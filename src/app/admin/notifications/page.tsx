import { PortalLayout } from "@/components/PortalLayout";
import { FeatureTable } from "@/components/FeatureTable";

export default function AdminNotifications() {
  return <PortalLayout role="admin" title="Notifications">
    <FeatureTable title="Notification Centre" description="System announcements and delivery status." action="list_notifications"
      columns={[{key:"title",label:"Notification"},{key:"audience",label:"Audience"},{key:"status",label:"Status"},{key:"date",label:"Date"}]} />
  </PortalLayout>;
}
