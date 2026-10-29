import { CourseIntake, DryRunIssue, DryRunResult } from '../types';

// Verhoeff algorithm tables for 12-digit APAAR / UID validation
const d = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 2, 3, 4, 0, 6, 7, 8, 9, 5],
  [2, 3, 4, 0, 1, 7, 8, 9, 5, 6],
  [3, 4, 0, 1, 2, 8, 9, 5, 6, 7],
  [4, 0, 1, 2, 3, 9, 5, 6, 7, 8],
  [5, 9, 8, 7, 6, 0, 4, 3, 2, 1],
  [6, 5, 9, 8, 7, 1, 0, 4, 3, 2],
  [7, 6, 5, 9, 8, 2, 1, 0, 4, 3],
  [8, 7, 6, 5, 9, 3, 2, 1, 0, 4],
  [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
];

const p = [
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
  [1, 5, 7, 6, 2, 8, 3, 0, 9, 4],
  [5, 8, 0, 3, 7, 9, 6, 1, 4, 2],
  [8, 9, 1, 6, 0, 4, 3, 5, 2, 7],
  [9, 4, 5, 3, 1, 2, 6, 8, 7, 0],
  [4, 2, 8, 6, 5, 7, 3, 9, 0, 1],
  [2, 7, 9, 3, 8, 0, 6, 4, 1, 5],
  [7, 0, 4, 6, 9, 1, 3, 2, 5, 8]
];

const inv = [0, 4, 3, 2, 1, 5, 6, 7, 8, 9];

/**
 * Validates a 12-digit APAAR ID using the standard Verhoeff algorithm
 */
export function validateApaarChecksum(apaarRaw: string): boolean {
  const clean = apaarRaw.replace(/[^0-9]/g, '');
  if (clean.length !== 12) return false;

  let c = 0;
  const reversedArray = clean.split('').reverse().map(Number);

  for (let i = 0; i < reversedArray.length; i++) {
    c = d[c][p[i % 8][reversedArray[i]]];
  }

  return c === 0;
}

/**
 * Generates a valid Verhoeff check-digit for 11 digits to construct a valid 12th digit
 */
export function generateValidApaar(prefix11: string): string {
  const clean = prefix11.replace(/[^0-9]/g, '').slice(0, 11);
  const padded = clean.padEnd(11, '7');
  
  let c = 0;
  const reversedArray = padded.split('').reverse().map(Number);
  for (let i = 0; i < reversedArray.length; i++) {
    c = d[c][p[(i + 1) % 8][reversedArray[i]]];
  }
  const checkDigit = inv[c];
  const full = padded + checkDigit;
  return `${full.slice(0, 4)}-${full.slice(4, 8)}-${full.slice(8, 12)}`;
}

/**
 * Deterministic SHA-256 simulator for privacy-preserving HMAC matching
 */
export function sha256Sim(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  const part2 = Math.abs(hash * 31).toString(16).padStart(8, '0');
  const part3 = Math.abs(hash * 97).toString(16).padStart(8, '0');
  const part4 = Math.abs(hash * 131).toString(16).padStart(8, '0');
  return `0x${hex}${part2}${part3}${part4}`;
}

/**
 * Computes Course Intake statistics & headroom
 */
export function calculateIntakeStatus(course: CourseIntake) {
  const regularEnrolled = course.enrolled.general + course.enrolled.obc + course.enrolled.sc_st + course.enrolled.ews;
  const regularLimit = course.sanctionedIntake;
  const regularPercentage = Math.round((regularEnrolled / regularLimit) * 100);

  const supernumeraryEnrolled = 
    course.enrolled.tfws + course.enrolled.pmsss + course.enrolled.nri + course.enrolled.oci + course.enrolled.fn;
  
  const supernumeraryLimit = 
    course.approvedSupernumerary.tfws + 
    course.approvedSupernumerary.pmsss + 
    course.approvedSupernumerary.nri + 
    course.approvedSupernumerary.oci + 
    course.approvedSupernumerary.fn;

  const totalEnrolled = regularEnrolled + supernumeraryEnrolled;
  const totalCapacity = regularLimit + supernumeraryLimit;
  const totalPercentage = Math.round((totalEnrolled / totalCapacity) * 100);

  const isWarning = totalPercentage >= 90 && totalPercentage <= 100;
  const isBreached = totalPercentage > 100 || regularEnrolled > regularLimit;

  return {
    regularEnrolled,
    regularLimit,
    regularPercentage,
    supernumeraryEnrolled,
    supernumeraryLimit,
    totalEnrolled,
    totalCapacity,
    totalPercentage,
    isWarning,
    isBreached,
    availableSeats: Math.max(0, totalCapacity - totalEnrolled)
  };
}

/**
 * Pre-submission Dry Run Validator:
 * Processes raw CSV rows, validates formats, detects quota limits, and calculates data health score
 */
export function performPreSubmissionDryRun(
  rawLines: string[],
  activeCourses: CourseIntake[]
): DryRunResult {
  const issues: DryRunIssue[] = [];
  const seenApaars = new Set<string>();
  let validCount = 0;

  const proposedCourseMap = new Map<string, number>();

  rawLines.forEach((line, index) => {
    const rowNum = index + 1;
    if (!line.trim()) return;

    const parts = line.split(',').map(s => s.trim());
    if (parts.length < 5) {
      issues.push({
        rowNumber: rowNum,
        field: 'RECORD_STRUCTURE',
        rawInput: line,
        errorCode: 'MISSING_MANDATORY_FIELD',
        message: 'Insufficient columns. Expected: APAAR_ID, Student_Name, Course_Code, Quota, Category_ID',
        suggestedFix: 'Provide full 5 comma-delimited columns for this student record.',
        severity: 'ERROR'
      });
      return;
    }

    const [apaar, name, courseCode, quota, extraDoc] = parts;

    // 1. Check APAAR Format
    const cleanApaar = apaar.replace(/[^0-9]/g, '');
    if (cleanApaar.length !== 12) {
      issues.push({
        rowNumber: rowNum,
        field: 'APAAR_ID',
        rawInput: apaar,
        errorCode: 'INVALID_APAAR_CHECKSUM',
        message: `Invalid APAAR length (${cleanApaar.length} digits). National ID must be exactly 12 digits.`,
        suggestedFix: 'Verify the student ABC/DigiLocker certificate for exact 12-digit number.',
        severity: 'ERROR'
      });
      return;
    }

    // 2. Check Verhoeff Checksum
    if (!validateApaarChecksum(cleanApaar)) {
      const fixedSample = generateValidApaar(cleanApaar.slice(0, 11));
      issues.push({
        rowNumber: rowNum,
        field: 'APAAR_ID',
        rawInput: apaar,
        errorCode: 'INVALID_APAAR_CHECKSUM',
        message: `APAAR Checksum validation failed for ${apaar} (Verhoeff Mod 11,10 algorithm).`,
        suggestedFix: `Re-enter official 12th check digit. (Checksum matched sample: ${fixedSample})`,
        severity: 'ERROR'
      });
      return;
    }

    // 3. File-level Duplicate check
    if (seenApaars.has(cleanApaar)) {
      issues.push({
        rowNumber: rowNum,
        field: 'APAAR_ID',
        rawInput: apaar,
        errorCode: 'DUPLICATE_IN_FILE',
        message: `Duplicate APAAR ID ${apaar} appears multiple times in this submission batch.`,
        suggestedFix: 'Remove or merge duplicate entries for the same student.',
        severity: 'ERROR'
      });
      return;
    }
    seenApaars.add(cleanApaar);

    // 4. Quota Document validations
    if ((quota === 'NRI' || quota === 'FN' || quota === 'OCI') && (!extraDoc || extraDoc.length < 5)) {
      issues.push({
        rowNumber: rowNum,
        field: 'QUOTA_DOCUMENTATION',
        rawInput: quota,
        errorCode: 'NRI_MISSING_PASSPORT',
        message: `Quota '${quota}' requires Passport/Visa Reference Number in Column 5.`,
        suggestedFix: 'Input valid passport and AICTE clearance certificate number.',
        severity: 'ERROR'
      });
      return;
    }

    // Count towards course intake
    const current = proposedCourseMap.get(courseCode) || 0;
    proposedCourseMap.set(courseCode, current + 1);

    validCount++;
  });

  // Calculate intake projections
  const intakeProjection = activeCourses.map(course => {
    const additional = proposedCourseMap.get(course.courseId) || 0;
    const current = course.enrolled.general + course.enrolled.obc + course.enrolled.sc_st + 
                    course.enrolled.ews + course.enrolled.tfws + course.enrolled.pmsss + 
                    course.enrolled.nri + course.enrolled.oci + course.enrolled.fn;
    const capacity = course.sanctionedIntake + 
      course.approvedSupernumerary.tfws + course.approvedSupernumerary.pmsss +
      course.approvedSupernumerary.nri + course.approvedSupernumerary.oci + course.approvedSupernumerary.fn;
    
    const willExceed = (current + additional) > capacity;

    if (willExceed) {
      issues.push({
        rowNumber: 0,
        field: 'INTAKE_CAP',
        rawInput: `${course.courseId} (+${additional} students)`,
        errorCode: 'INTAKE_CAP_EXCEEDED',
        message: `Proposed batch of +${additional} students causes ${course.courseName} to exceed total approved capacity (${current + additional}/${capacity}).`,
        suggestedFix: `Reduce intake by ${(current + additional) - capacity} students or apply for supernumerary intake expansion with AICTE.`,
        severity: 'ERROR'
      });
    }

    return {
      courseName: course.courseName,
      currentEnrolled: current,
      newProposed: additional,
      sanctionedLimit: capacity,
      willExceed
    };
  });

  const total = rawLines.filter(l => l.trim().length > 0).length;
  const invalidCount = issues.filter(i => i.severity === 'ERROR').length;
  const validTotal = Math.max(0, total - invalidCount);
  
  const rawScore = total > 0 ? Math.round((validTotal / total) * 100) : 100;
  const penalty = issues.filter(i => i.errorCode === 'INTAKE_CAP_EXCEEDED').length * 20;
  const dataHealthScore = Math.max(0, Math.min(100, rawScore - penalty));

  return {
    totalRowsProcessed: total,
    validRows: validTotal,
    invalidRows: invalidCount,
    dataHealthScore,
    issues,
    intakeProjection
  };
}
