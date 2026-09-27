import { PortalLayout } from "@/components/PortalLayout";
import { FeatureTable } from "@/components/FeatureTable";

export default function StudentIdCard() {
  return <PortalLayout role="student" title="Student ID Card">
    <FeatureTable title="Digital Student ID" description="Your current identity and enrolment information." action="list_id_card"
      columns={[{key:"name",label:"Student"},{key:"matricNo",label:"Matric No"},{key:"programme",label:"Programme"},{key:"level",label:"Level"},{key:"status",label:"Status"}]} />
  </PortalLayout>;
}
