import React, { useMemo, useState } from 'react';
import {
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScreenContainer } from '@components/ScreenContainer';
import PosterCanvas from '@components/poster/PosterCanvas';
import { ProfileStackParamList } from '@app/navigation/types';
import { typography } from '@theme/typography';
import { palette } from '@theme/colors';
import NeonCard from '@components/NeonCard';
import NeonButton from '@components/NeonButton';

type TemplateInfo = { id: string; image: ImageSourcePropType };

const templates: Record<string, TemplateInfo[]> = {
  '9:16': [
    { id: 'A', image: require('@assets/posters/templateA_9x16.png') },
    { id: 'B', image: require('@assets/posters/templateB_9x16.png') },
    { id: 'C', image: require('@assets/posters/templateC_9x16.png') },
  ],
  '1:1': [
    { id: 'A', image: require('@assets/posters/templateA_1x1.png') },
    { id: 'B', image: require('@assets/posters/templateB_1x1.png') },
    { id: 'C', image: require('@assets/posters/templateC_1x1.png') },
  ],
  '16:9': [
    { id: 'A', image: require('@assets/posters/templateA_16x9.png') },
    { id: 'B', image: require('@assets/posters/templateB_16x9.png') },
    { id: 'C', image: require('@assets/posters/templateC_16x9.png') },
  ],
};

const ratios = Object.keys(templates);

export const PosterWorkshopScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const [ratio, setRatio] = useState<string>('9:16');
  const [templateId, setTemplateId] = useState<string>('A');

  const ratioTemplates = templates[ratio];
  const activeTemplate = useMemo(() => {
    return ratioTemplates.find((item) => item.id === templateId) ?? ratioTemplates[0];
  }, [ratioTemplates, templateId]);

  const handleRatioChange = (next: string) => {
    setRatio(next);
    setTemplateId(templates[next][0].id);
  };

  return (
    <ScreenContainer variant="plain" scrollable>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>返回</Text>
        </Pressable>
        <Text style={styles.headerTitle}>海报工坊</Text>
      </View>

      <View style={styles.ratioRow}>
        {ratios.map((item) => {
          const active = ratio === item;
          return (
            <Pressable
              key={item}
              style={[styles.ratioPill, active && styles.ratioPillActive]}
              onPress={() => handleRatioChange(item)}
            >
              <Text style={[styles.ratioText, active && styles.ratioTextActive]}>{item}</Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.templateRow}
      >
        {ratioTemplates.map((template) => {
          const active = template.id === templateId;
          return (
            <Pressable key={`${ratio}-${template.id}`} onPress={() => setTemplateId(template.id)}>
              <NeonCard
                style={[styles.templateCard, active && styles.templateCardActive]}
                contentPadding={0}
                borderRadius={18}
              >
                <ImageBackground
                  source={template.image}
                  style={styles.templateThumb}
                  imageStyle={styles.templateThumbImage}
                >
                  <Text style={styles.templateId}>模板 {template.id}</Text>
                </ImageBackground>
              </NeonCard>
            </Pressable>
          );
        })}
      </ScrollView>

      <Text style={styles.previewLabel}>画布预览</Text>
      <PosterCanvas template={activeTemplate.image as number} ratio={ratio} />

      <View style={styles.actions}>
        <NeonButton title="保存占位图" onPress={() => console.log('save placeholder')} />
        <Pressable style={styles.secondaryBtn} onPress={() => console.log('share placeholder')}>
          <Text style={styles.secondaryText}>分享 / 复制文案（占位）</Text>
        </Pressable>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  backBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  backText: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  headerTitle: {
    ...typography.heading,
    color: palette.text,
  },
  ratioRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  ratioPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  ratioPillActive: {
    borderColor: '#00E5FF',
    backgroundColor: 'rgba(0,229,255,0.12)',
  },
  ratioText: {
    ...typography.captionCaps,
    color: palette.sub,
  },
  ratioTextActive: {
    color: '#00E5FF',
  },
  templateRow: {
    gap: 12,
    paddingBottom: 8,
  },
  templateCard: {
    width: 160,
    borderRadius: 20,
  },
  templateCardActive: {
    shadowColor: '#00E5FF',
  },
  templateThumb: {
    height: 200,
    justifyContent: 'flex-end',
    padding: 12,
  },
  templateThumbImage: {
    borderRadius: 18,
  },
  templateId: {
    ...typography.captionCaps,
    color: '#FFFFFF',
    alignSelf: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.45)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  previewLabel: {
    ...typography.subtitle,
    color: palette.text,
    marginVertical: 16,
  },
  actions: {
    marginTop: 24,
    gap: 12,
  },
  secondaryBtn: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryText: {
    ...typography.captionCaps,
    color: palette.text,
  },
});

export default PosterWorkshopScreen;
