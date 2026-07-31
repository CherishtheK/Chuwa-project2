import { useQuery } from "@apollo/client/react";
import { MY_PERSONAL_INFO_QUERY } from "./graphql/PersonalInfoQueries";
import NameSection from "./NameSection";
import AddressSection from "./AddressSection";
import ContactSection from "./ContactSection";
import EmergencyContactSection from "./EmergencyContactSection";
import DocumentsSection from "./DocumentsSection";
import type { MyPersonalInfoResult } from "../../types/personalInfo";

export default function PersonalInformationPage() {
  const { data, loading, refetch } = useQuery<MyPersonalInfoResult>(
    MY_PERSONAL_INFO_QUERY,
    { fetchPolicy: "network-only" },
  );

  if (loading) return <p>Loading...</p>;

  const info = data?.myPersonalInfo;

  if (!info) {
    return <p>Personal information is only available after your application is approved.</p>;
  }

  return (
    <div className="space-y-6">
      <h1>Personal Information</h1>
      <NameSection info={info} onSaved={refetch} />
      <AddressSection info={info} onSaved={refetch} />
      <ContactSection info={info} onSaved={refetch} />
      <EmergencyContactSection info={info} onSaved={refetch} />
      <DocumentsSection info={info} />
    </div>
  );
}