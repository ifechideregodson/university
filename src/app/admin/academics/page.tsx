import { PortalLayout } from "@/components/PortalLayout";
import { FeatureTable } from "@/components/FeatureTable";

export default function AdminAcademics() {
  return <PortalLayout role="admin" title="Academic Structure">
    <FeatureTable title="Academic Structure" description="Faculties, departments, programmes and academic sessions." action="list_academic_structure"
      columns={[{key:"faculty",label:"Faculty"},{key:"department",label:"Department"},{key:"programme",label:"Programme"},{key:"level",label:"Level"}]} />
  </PortalLayout>;
}
