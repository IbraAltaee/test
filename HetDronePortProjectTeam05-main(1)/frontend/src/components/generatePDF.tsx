import { generateEmailBody } from "@/utils/generateEmailBody";
import { Document, Page, StyleSheet, Text } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30 },
  text: { fontSize: 12, marginBottom: 5 },
  boldText: { fonstSize: 12, fontWeight: "bold", marginBottom: 10 },
});

const generateText = (data: any) => {
  let text = generateEmailBody(data);

  const lines = text
    .split("\n")
    .filter(
      (line) =>
        !line.includes("You can find the generated KML as an attachment") &&
        !line.includes(
          "A request has been generated using the following UAV data",
        ),
    );

  return lines.map((lines, i) => {
    const shouldBeBold = !lines.trim().startsWith("-");

    return (
      <Text key={i} style={shouldBeBold ? styles.boldText : styles.text}>
        {lines}
      </Text>
    );
  });
};

const MyDocument = ({ data }: any) => {
  const text = generateText(data);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.boldText}>Calculation Results:</Text>
        {text}
      </Page>
    </Document>
  );
};

export default MyDocument;
