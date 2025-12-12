import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 35,
        fontFamily: 'Helvetica',
        fontSize: 10,
        lineHeight: 1.5,
        color: '#1f2937',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 0,
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
        marginBottom: 4,
    },
    contact: {
        fontSize: 9,
        color: '#4b5563',
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        marginBottom: 8,
        marginTop: 15,
        letterSpacing: 1,
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingLeft: 5,
    },
    bullet: {
        width: 15,
        fontSize: 10,
        fontWeight: 'bold',
    },
    text: {
        flex: 1,
    },
    skillSection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 5,
    },
    skillTag: {
        backgroundColor: '#f3f4f6',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 2,
        fontSize: 9,
        marginRight: 5,
        marginBottom: 5,
    }
});

interface CVData {
    jobTitle: string;
    cv_suggestions: string[];
    skills: any[];
    user?: {
        name: string;
        email: string;
        phone?: string;
    };
    translations: any;
}

export const TailoredCVPDF = ({ data }: { data: CVData }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header with User Info */}
            <View style={styles.header}>
                <Text style={styles.name}>{data.user?.name || data.translations.namePlaceholder}</Text>
                <Text style={styles.contact}>
                    {data.user?.email || 'email@example.com'} | {data.user?.phone || '(123) 456-7890'} | Location
                </Text>
            </View>

            {/* Professional Summary */}
            <Text style={styles.sectionTitle}>{data.translations.professionalProfile}</Text>
            <Text style={{ marginBottom: 10 }}>
                {data.translations.profileTemplate
                    .replace('{jobTitle}', data.jobTitle)
                    .replace('{skills}', data.skills.slice(0, 3).map(s => s.name).join(', '))}
            </Text>

            {/* Core Competencies (Matched Skills) */}
            <Text style={styles.sectionTitle}>{data.translations.coreCompetencies}</Text>
            <View style={styles.skillSection}>
                {data.skills.filter(s => s.must).map((skill, i) => (
                    <Text key={i} style={styles.skillTag}>{skill.name}</Text>
                ))}
                {data.skills.filter(s => !s.must).slice(0, 5).map((skill, i) => (
                    <Text key={i} style={styles.skillTag}>{skill.name}</Text>
                ))}
            </View>

            {/* Tailored Experience Bullets */}
            <Text style={styles.sectionTitle}>{data.translations.relevantExperience}</Text>
            <Text style={{ fontSize: 9, color: '#6b7280', marginBottom: 6, fontStyle: 'italic' }}>
                {data.translations.aiDisclaimer}
            </Text>

            {data.cv_suggestions.map((point, i) => (
                <View key={i} style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.text}>{point}</Text>
                </View>
            ))}

            {/* Placeholder Experience */}
            <View style={{ marginTop: 10 }}>
                <Text style={{ fontWeight: 'bold' }}>{data.translations.placeholderRole}</Text>
                <Text style={{ fontSize: 9, color: '#4b5563', marginBottom: 4 }}>Date - Date</Text>
                <View style={styles.bulletPoint}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.text}>{data.translations.placeholderDesc}</Text>
                </View>
            </View>

            {/* Education */}
            <Text style={styles.sectionTitle}>{data.translations.education}</Text>
            <View>
                <Text style={{ fontWeight: 'bold' }}>{data.translations.degreePlaceholder}</Text>
                <Text>{data.translations.universityPlaceholder}</Text>
            </View>

        </Page>
    </Document>
);
