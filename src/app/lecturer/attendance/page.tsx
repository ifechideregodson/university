import { PortalLayout } from "@/components/PortalLayout";
import { FeatureTable } from "@/components/FeatureTable";

export default function LecturerAttendance() {
  return <PortalLayout role="lecturer" title="Attendance Management">
    <FeatureTable title="Attendance Overview" description="Course attendance records." action="list_attendance"
      columns={[{key:"course",label:"Course"},{key:"held",label:"Classes Held"},{key:"attended",label:"Attended"},{key:"percentage",label:"Attendance"}]} />
  </PortalLayout>;
}
