import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';

// Register fonts (standard fonts don't need registration, but for custom styling)
// Font.register({ family: 'Inter', src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.ttf' });

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#334155',
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        paddingBottom: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 12,
        color: '#64748b',
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#0f172a',
        marginBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        paddingBottom: 4,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 4,
    },
    label: {
        fontWeight: 'bold',
        width: 100,
    },
    value: {
        flex: 1,
    },
    score: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#0d9488',
        marginBottom: 4,
    },
    skillRow: {
        flexDirection: 'row',
        marginBottom: 6,
        paddingBottom: 6,
        borderBottomWidth: 0.5,
        borderBottomColor: '#f1f5f9',
    },
    skillName: {
        fontWeight: 'bold',
        width: '30%',
        color: '#0f172a',
    },
    skillDesc: {
        width: '70%',
        color: '#64748b',
        fontSize: 9,
    },
    badge: {
        backgroundColor: '#f0fdfa',
        color: '#0f766e',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
        fontSize: 8,
        marginLeft: 4,
    }
});

interface AnalysisData {
    title: string;
    match_score: number;
    skills: any[];
    gaps: any[];
    roadmap: Record<string, any[]>;
    category?: string;
    translations: any;
}

export const AnalysisReportPDF = ({ data }: { data: AnalysisData }) => (
    <Document>
        <Page size="A4" style={styles.page}>

            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>{data.title}</Text>
                <Text style={styles.subtitle}>{data.translations.title} • {data.category || data.translations.subtitle}</Text>
            </View>

            {/* Match Score */}
            <View style={styles.section}>
                <Text>{data.translations.matchScore}</Text>
                <Text style={styles.score}>{data.match_score}%</Text>
                <Text style={{ fontSize: 9, color: '#94a3b8' }}>{data.translations.matchScoreDesc}</Text>
            </View>

            {/* Skills */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{data.translations.requiredSkills}</Text>
                {data.skills.map((skill, i) => (
                    <View key={i} style={styles.skillRow}>
                        <View style={{ width: '30%' }}>
                            <Text style={{ fontWeight: 'bold' }}>{skill.name}</Text>
                            {skill.must && <Text style={{ color: '#ef4444', fontSize: 8 }}>{data.translations.mustHave}</Text>}
                        </View>
                        <Text style={styles.skillDesc}>{skill.explanation}</Text>
                    </View>
                ))}
            </View>

            {/* Gaps */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{data.translations.skillGaps}</Text>
                {data.gaps.map((gap, i) => (
                    <View key={i} style={{ marginBottom: 6 }}>
                        <Text style={{ fontWeight: 'bold', color: '#b91c1c' }}>{gap.skill}</Text>
                        <Text style={{ fontSize: 9 }}>{gap.reason}</Text>
                        <Text style={{ fontSize: 8, color: '#64748b' }}>{data.translations.estTime}: {gap.recommended_days} {data.translations.days}</Text>
                    </View>
                ))}
                {data.gaps.length === 0 && <Text style={{ color: '#16a34a' }}>{data.translations.noGaps}</Text>}
            </View>

            {/* Roadmap */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>{data.translations.roadmap}</Text>
                {Object.entries(data.roadmap).map(([topic, tasks], i) => (
                    <View key={i} style={{ marginBottom: 10 }}>
                        <Text style={{ fontWeight: 'bold', marginBottom: 2 }}>{topic}</Text>
                        {tasks.map((task, j) => (
                            <Text key={j} style={{ fontSize: 9, marginLeft: 10, marginBottom: 1 }}>• {task.task}</Text>
                        ))}
                    </View>
                ))}
            </View>

        </Page>
    </Document>
);
