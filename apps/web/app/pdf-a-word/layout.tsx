import { ToolGuide } from "../../components/ToolGuide";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToolGuide slug="pdf-a-word" />
    </>
  );
}
