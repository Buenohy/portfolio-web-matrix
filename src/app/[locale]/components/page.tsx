import Button from "@/components/Button";
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
        <Text as="h1" variant="heading-large">Text</Text>
      </div>
    </section>
  )
}
