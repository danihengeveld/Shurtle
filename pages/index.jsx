import {
  Container,
  VStack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  FormHelperText,
  Divider,
  Button,
  InputGroup,
  InputLeftAddon,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import * as yup from "yup";

export default function Home() {
  const toast = useToast();

  return (
    <Container
      as="main"
      py={{ base: 4, md: 8, lg: 12 }}
      px={{ base: 4, md: 8, lg: 12 }}
      justifyContent="center"
      centerContent
    >
      <VStack spacing="6">
        <Heading as="h1" size="4xl" fontWeight="semibold">
          Shurtle
        </Heading>
        <Divider />
        <Formik
          initialValues={{ url: "", slug: "" }}
          onSubmit={async (values, actions) => {
            await handleSubmit(values, actions, toast);
            actions.setSubmitting(false);
          }}
          validationSchema={yup.object({
            url: yup
              .string()
              .url("Must be a valid URL!")
              .required("Cannot be empty!"),
            slug: yup
              .string()
              .matches(
                /^[a-zA-Z0-9-]*$/,
                "Only letters, numbers and hyphens are allowed!"
              )
              .required("Cannot be empty!"),
          })}
        >
          {(props) => (
            <Form>
              <VStack spacing="4">
                <Field name="url">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.url && form.touched.url}
                    >
                      <FormLabel htmlFor="url">Full URL</FormLabel>
                      <Input
                        {...field}
                        id="url"
                        type="url"
                        placeholder="https://youtube.com/"
                      />
                      <FormHelperText>
                        The full URL that you are trying to shorten.
                      </FormHelperText>
                      <FormErrorMessage>{form.errors.url}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Field name="slug">
                  {({ field, form }) => (
                    <FormControl
                      isInvalid={form.errors.slug && form.touched.slug}
                    >
                      <FormLabel htmlFor="slug">Shurtle Link</FormLabel>
                      <InputGroup>
                        <InputLeftAddon>shurtle.app/</InputLeftAddon>
                        <Input
                          {...field}
                          id="slug"
                          type="text"
                          placeholder="yt"
                        />
                      </InputGroup>
                      <FormHelperText>
                        The Shortle URL to shorten to.
                      </FormHelperText>
                      <FormErrorMessage>{form.errors.slug}</FormErrorMessage>
                    </FormControl>
                  )}
                </Field>
                <Button
                  alignSelf="end"
                  isLoading={props.isSubmitting}
                  type="submit"
                >
                  Shurtle it!
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </VStack>
    </Container>
  );
}

async function handleSubmit(values, actions, toast) {
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  };

  const response = await fetch("/api/create-url", requestOptions);
  const json = await response.json();

  if (!response.ok) {
    toast({
      title: "Choose a different slug!",
      description: json.message,
      status: "error",
      duration: 10000,
      position: "bottom",
      variant: "top-accent",
      isClosable: true,
    });

    actions.setFieldValue("url", values.url);
    actions.setFieldValue("slug", "");

    return;
  }

  toast({
    title: "Shortled!",
    description: `Reachable at: shortle.app/${json.slug}`,
    status: "success",
    duration: 10000,
    position: "bottom",
    variant: "top-accent",
    isClosable: true,
  });

  actions.setFieldValue("url", "");
  actions.setFieldValue("slug", "");
  actions.setTouched({}, false);
}
