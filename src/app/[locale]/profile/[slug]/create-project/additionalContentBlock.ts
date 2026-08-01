// Блоки додаткової інформації про проєкт — точний аналог content_blocks-редактора
// з save-art (AdditionalInformation.jsx): заголовок/текст/зображення/посилання.
export type AdditionalContentBlock =
  | { id: number; type: "heading"; headingUk: string; headingEn: string }
  | { id: number; type: "paragraph"; paragraphUk: string; paragraphEn: string }
  | { id: number; type: "image"; image: string }
  | { id: number; type: "link"; url: string };
