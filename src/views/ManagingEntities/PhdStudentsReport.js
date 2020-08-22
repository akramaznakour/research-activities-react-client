import React, { useEffect } from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  body: {
    paddingTop: 35,
    paddingBottom: 65,
    paddingHorizontal: 35,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
  },
  author: {
    fontSize: 12,
    textAlign: "center",
    marginBottom: 40,
  },
  subtitle: {
    fontSize: 18,
    margin: 12,
  },
  text: {
    margin: 12,
    fontSize: 14,
    textAlign: "justify",
  },
  header: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
    color: "grey",
  },
  table: {
    display: "table",
    borderStyle: "solid",
    borderColor: "#eceeef",
    borderWidth: 1,
    marginBottom: "2rem",
  },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableCol: {
    borderStyle: "solid",
    borderColor: "#eceeef",
    borderWidth: 1,
    padding: "1rem",
  },
  tableCell: { margin: "auto", marginTop: 5, fontSize: 10 },
});

// Create Document Component
const PhdStudentsReport = ({ students, user }) => {
  useEffect(() => {
    console.log("should update");
  }, [students]);

  return (
    <Document
      author={[user.firstName, user.lastName].join(" ")}
      keywords={[user.firstName, user.lastName].join(" ")}
      subject={[user.firstName, user.lastName].join(" ")}
      title={[user.firstName, user.lastName].join(" ")}
      
    >
      <Page orientation="landscape" style={styles.body}>
        <Text style={styles.subtitle}>{`Vos Doctorants Monsieur ${[user.firstName, user.lastName].join(" ")}:`}</Text>
        <View style={styles.table}>
          {/* TableHeader */}
          <View style={styles.tableRow}>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.tableCell}>Directeur de thèse</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.tableCell}>Co-Directeur de thèse</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.tableCell}>Nom de doctorant</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.tableCell}>Prénom de doctorant</Text>
            </View>

            <View style={{ ...styles.tableCol, width: "70%" }}>
              <Text style={styles.tableCell}>Intitulé de la Thèse</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.tableCell}>Cotutelle (CT) - Codirection (CD)</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.tableCell}>Année de 1 ère inscription</Text>
            </View>
            <View style={{ ...styles.tableCol, width: "20%" }}>
              <Text style={styles.tableCell}>Date de soutenance</Text>
            </View>
          </View>
          {students.map((student, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={{ ...styles.tableCol, width: "20%" }}>
                <Text style={styles.tableCell}>{student.supervisor}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "20%" }}>
                <Text style={styles.tableCell}>{student.coSupervisor} </Text>
              </View>
              <View style={{ ...styles.tableCol, width: "20%" }}>
                <Text style={styles.tableCell}>{student.lastName} </Text>
              </View>
              <View style={{ ...styles.tableCol, width: "20%" }}>
                <Text style={styles.tableCell}>{student.firstName}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "70%" }}>
                <Text style={styles.tableCell}>{student.thesisTitle}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "20%" }}>
                <Text style={styles.tableCell}>{student.cotutelle}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "20%" }}>
                <Text style={styles.tableCell}>{student.start}</Text>
              </View>
              <View style={{ ...styles.tableCol, width: "20%" }}>
                <Text style={styles.tableCell}>{student.end}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default PhdStudentsReport;
