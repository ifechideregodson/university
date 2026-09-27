# Retool Database + Workflow Build Sheet

This document turns the v7 Workflow contract into concrete Retool steps. Keep all database resources and secrets inside Retool.

## 1. Workflow structure

Create one Workflow with:

1. Webhook/API trigger
2. `validate_request` JS block
3. `route_action` switch/router
4. One branch per action
5. Final JSON response

The Next.js server sends `action`, `actor`, and action-specific data. The browser never receives the Retool database credentials.

## 2. Request validation

Require a server-side shared secret. In the first JS block, compare the Authorization header to the secret stored in a Retool Secret. Reject missing/invalid credentials with HTTP 401.

For every mutating action, also require `actor.role` to be one of the roles documented below.

## 3. Core read actions

### student_dashboard
Role: student.

Queries:
- Student record by `users.id = actor.id`.
- Registered courses by `course_registrations.student_id`.
- Current results and calculate CGPA from `grade_point * units` / total units.
- Upcoming exams from courses the student is registered for.
- Outstanding fees from the student's payment/fee records.

Return:
```json
{
  "student": {},
  "registeredCourses": [],
  "cgpa": 0,
  "upcomingExams": [],
  "outstandingFees": 0,
  "courses": []
}
```

### list_student_courses
Role: student.

Join `course_registrations` to `courses`, filtered by the authenticated student and current session/semester.

### list_student_results
Role: student.

Join `results` to `courses`, filtered by authenticated student. Return only published results unless the workflow is being called by an authorized staff role.

### list_student_payments
Role: student.

Filter `payments.student_id` by the authenticated student. Never accept a browser-supplied student ID for this action.

### lecturer_dashboard
Role: lecturer.

Resolve the lecturer record from `users.id = actor.id`. Query courses assigned to that lecturer, registered students, ungraded assignment submissions, and upcoming exams.

### admin_dashboard
Role: admin.

Return counts for active students, active lecturers, programmes, pending admissions, and the current academic session.

## 4. Mutation rules

### register_courses
Role: student.
- Resolve student from actor.
- Resolve current session/semester.
- Validate every course exists and is active.
- Prevent duplicate registrations.
- Insert registrations.
- Write an audit log.

### submit_exam
Role: student.
- Resolve student from actor.
- Validate exam is open.
- Create/update an exam attempt.
- Save answers.
- Calculate score from the questions stored in Retool.
- Write an audit log.

### publish_result
Role: lecturer or admin.
- Resolve the result and related course.
- For lecturer, verify the lecturer owns the course.
- Set result status to `Published`.
- Write audit log.

### approve_admission
Role: admin.
- Resolve application.
- Set status to `Approved`.
- Optionally create user/student records in the same workflow.
- Generate matric number according to your university's chosen format.
- Create an audit log.

### create_course / update_course
Role: lecturer or admin.
- Lecturer must own the department/course scope.
- Admin can manage all courses.
- Validate course code uniqueness.
- Audit the change.

### create_material / create_assignment / create_exam / create_question
Role: lecturer or admin.
- Verify course ownership.
- Insert record.
- Audit the action.

### grade_assignment
Role: lecturer or admin.
- Verify lecturer owns the assignment's course.
- Update score and feedback.
- Audit the grading event.

### initialize_payment
Role: student.
- Resolve the student from actor.
- Generate a unique internal reference.
- Call the configured payment provider from Retool.
- Store the pending payment record.
- Return only the payment URL/reference needed by the browser.

## 5. Suggested response envelope

Use the same shape for every branch:
```json
{
  "ok": true,
  "action": "student_dashboard",
  "data": {},
  "error": null
}
```

Errors should use:
```json
{
  "ok": false,
  "action": "...",
  "data": null,
  "error": "Human-readable message"
}
```

## 6. Security checklist

- Do not put Retool API/database credentials in `NEXT_PUBLIC_*` variables.
- Do not trust `student_id`, `lecturer_id`, or `user_id` supplied by the browser.
- Resolve identity from the signed Next.js session.
- Validate role on every branch.
- Validate ownership before lecturer mutations.
- Audit every mutation.
- Return only fields needed by the UI.
- Add rate limiting before public production launch.
- Configure backups and retention for academic records.
