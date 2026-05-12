import Badge from "@/components/Badge";
import Button from "@/components/Button";
import Card from "@/components/Card";
import Text from "@/components/Text";

export default function ComponentsPage() {
  return (
    <section
      id="home"
      className="flex items-center justify-center scroll-smooth px-5 pt-20 pb-30 md:px-10"
    >
      <div className="mx-auto mt-10 flex w-fit flex-col gap-5">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="redPill">Red Pill</Button>
        <Button variant="bluePill">Blue Pill</Button>
        <Button variant="ghost">Ghost</Button>
        <Button disabled>Disabled</Button>
        <Button handling>Loading</Button>
        <Text as="h1" variant="heading-large">Text</Text>
        <Badge>Badge</Badge>
        <Badge loading>Loading</Badge>
        <Card className="flex flex-col gap-5">
          <Button variant="ghost" size="sm">Ghost Sm</Button>
          <Button variant="primary" size="sm">Ghost Sm</Button>
          <Button >Texte importação</Button>
        </Card>
        <Button variant="matrixPrimary">Matrix Primary</Button>
        <Button variant="matrixSecondary">Matrix Secondary</Button>
      </div>
    </section>
  )
}
