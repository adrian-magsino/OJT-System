import { getHTEById } from "@/lib/services/hte-service";

export default async function HteProfile({ hte_id }) {

  const {hte, error} = await getHTEById(hte_id);

  if (error) {
    return (
      <div className="bg-white h-full flex items-center justify-center">
        <p className="text-red-500">Error loading HTE: {error.message}</p>
      </div>
    );
  }

  if (!hte) {
    return (
      <div className="bg-white h-full flex items-center justify-center">
        <p className="text-gray-500">No HTE data available</p>
      </div>
    );
  }

  const sample_text = `
  Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.

Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.
  `

  return (
    // Remove unnecessary labels (location, hte_id, etc.) for final design 
    <div className="bg-white h-full flex flex-col gap-4 px-4 py-2">
      <div>
        <p>company logo</p>
        <h3 className="font-bold text-xl">{hte.name}</h3>
        <p>Location: {hte.location}</p>
        <p>HTE ID: {hte.hte_id}</p>
      </div>

      <div>
        <h3 className="font-bold text-md text-green-800">DESCRIPTION SECTION</h3>
        <p>Nature of work: {hte.nature_of_work}</p>
        <p>Description: {hte.description}</p>
      </div>

      <div>
        <h3 className="font-bold text-md text-green-800">CONTACTS</h3>
        <p>Email: {hte.email}</p>
        <p>Contact Number: {hte.contact_number}</p>
        <p>Website: {hte.website}</p>
      </div>


    </div>
  );
}