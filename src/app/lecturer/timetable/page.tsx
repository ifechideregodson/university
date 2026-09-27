import { PortalLayout } from "@/components/PortalLayout";
import { FeatureTable } from "@/components/FeatureTable";

export default function LecturerTimetable() {
  return <PortalLayout role="lecturer" title="Teaching Timetable">
    <FeatureTable title="Teaching Timetable" description="Your current teaching schedule." action="list_timetable"
      columns={[{key:"day",label:"Day"},{key:"time",label:"Time"},{key:"course",label:"Course"},{key:"venue",label:"Venue"}]} />
  </PortalLayout>;
}
