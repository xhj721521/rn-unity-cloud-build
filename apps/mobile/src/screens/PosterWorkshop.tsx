import React, { useMemo, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ImageBackground,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import LinearGradient from 'react-native-linear-gradient';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { ProfileStackParamList } from '@app/navigation/types';
import { typography } from '@theme/typography';

type PosterRatio = '9_16' | '1_1' | '16_9';

type TemplateInfo = { id: string; image: ImageSourcePropType };

const ratioLabelMap: Record<PosterRatio, string> = {
  '9_16': '9:16',
  '1_1': '1:1',
  '16_9': '16:9',
};

const ratioTemplates: Record<string, TemplateInfo[]> = {
  '9:16': [
    { id: 'A', image: require('../assets/posters/templateA_9x16.png') },
    { id: 'B', image: require('../assets/posters/templateB_9x16.png') },
    { id: 'C', image: require('../assets/posters/templateC_9x16.png') },
  ],
  '1:1': [
    { id: 'A', image: require('../assets/posters/templateA_1x1.png') },
    { id: 'B', image: require('../assets/posters/templateB_1x1.png') },
    { id: 'C', image: require('../assets/posters/templateC_1x1.png') },
  ],
  '16:9': [
    { id: 'A', image: require('../assets/posters/templateA_16x9.png') },
    { id: 'B', image: require('../assets/posters/templateB_16x9.png') },
    { id: 'C', image: require('../assets/posters/templateC_16x9.png') },
  ],
};

const posterTemplates = Object.keys(ratioLabelMap) as PosterRatio[];

const { width: screenWidth } = Dimensions.get('window');

export const PosterWorkshopScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ProfileStackParamList>>();
  const bottomTabBarHeight = useBottomTabBarHeight?.() ?? 0;
  const [selectedRatio, setSelectedRatio] = useState<PosterRatio>('9_16');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('A');

  const activeRatioLabel = ratioLabelMap[selectedRatio];
  const templates = ratioTemplates[activeRatioLabel];

  const activeTemplate = useMemo(() => {
    return templates.find((item) => item.id === selectedTemplateId) ?? templates[0];
  }, [templates, selectedTemplateId]);

  const handleChangeRatio = (ratio: PosterRatio) => {
    setSelectedRatio(ratio);
    setSelectedTemplateId(ratioTemplates[ratioLabelMap[ratio]][0].id);
  };

  const handleSavePoster = () => {
    console.log('save placeholder');
  };

  const handleSharePoster = () => {
    console.log('share placeholder');
  };

  const inviteCode = 'ABCD12';
  const teamName = 'Trinity';

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          paddingBottom: bottomTabBarHeight ? bottomTabBarHeight + 24 : 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backIcon}>{'<'}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>海报工坊</Text>
        </View>

        <View style={styles.segmentRow}>
          {posterTemplates.map((ratio) => {
            const active = ratio === selectedRatio;
            return (
              <TouchableOpacity
                key={ratio}
                onPress={() => handleChangeRatio(ratio)}
                style={[styles.segmentPill, active && styles.segmentPillActive]}
              >
                <LinearGradient
                  colors={active ? ['#00E0FF', '#8A5DFF'] : ['transparent', 'transparent']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.segmentGradient}
                >
                  <Text style={[styles.segmentText, active && styles.segmentTextActive]}>
                    {ratioLabelMap[ratio]}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </View>

        <FlatList
          data={templates}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.templateList}
          ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
          renderItem={({ item }) => {
            const active = item.id === selectedTemplateId;
            return (
              <TemplateCard
                template={item}
                active={active}
                onSelect={() => setSelectedTemplateId(item.id)}
              />
            );
          }}
        />

        <Text style={styles.previewLabel}>画布预览</Text>
        <PosterPreview ratio={selectedRatio} inviteCode={inviteCode} teamName={teamName}>
          <ImageBackground
            source={activeTemplate.image}
            resizeMode="cover"
            style={styles.templateImageOverlay}
            imageStyle={{ borderRadius: 24 }}
          />
        </PosterPreview>

        <View style={styles.primaryButtonWrapper}>
          <TouchableOpacity activeOpacity={0.9} onPress={handleSavePoster}>
            <LinearGradient
              colors={['#00E0FF', '#8A5DFF']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>保存占位图</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.secondaryButtonWrapper}>
          <TouchableOpacity style={styles.secondaryButton} onPress={handleSharePoster}>
            <Text style={styles.secondaryButtonText}>分享 / 复制文案（占位）</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

type TemplateCardProps = {
  template: TemplateInfo;
  active: boolean;
  onSelect: () => void;
};

const TemplateCard = ({ template, active, onSelect }: TemplateCardProps) => {
  const cardWidth = (screenWidth - 32) * 0.5;
  const cardHeight = (cardWidth * 16) / 9;

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={onSelect}>
      <LinearGradient
        colors={active ? ['#00E0FF', '#8A5DFF'] : ['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.05)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.templateCard, { width: cardWidth, height: cardHeight }]}
      >
        <View style={styles.templateInner}>
          <ImageBackground
            source={template.image}
            style={styles.templateImage}
            imageStyle={{ borderRadius: 18 }}
          />
          <View style={styles.templateBadge}>
            <Text style={styles.templateBadgeText}>模板 {template.id}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

type PosterPreviewProps = {
  ratio: PosterRatio;
  inviteCode: string;
  teamName: string;
  children?: React.ReactNode;
};

const PosterPreview = ({ ratio, inviteCode, teamName, children }: PosterPreviewProps) => {
  const baseWidth = screenWidth - 64;
  const innerWidth = baseWidth - 32;
  let height = innerWidth;
  if (ratio === '9_16') {
    height = (innerWidth * 16) / 9;
  } else if (ratio === '16_9') {
    height = (innerWidth * 9) / 16;
  }

  return (
    <View style={styles.previewCard}>
      <View style={styles.ratioBadge}>
        <Text style={styles.ratioBadgeText}>{ratioLabelMap[ratio]}</Text>
      </View>
      <LinearGradient
        colors={['#0B1A3A', '#050816']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.posterSurface, { height }]}
      >
        {children}
        <View style={styles.posterContent}>
          <View style={styles.posterCopy}>
            <Text style={styles.posterTitle}>加入我的队</Text>
            <Text style={styles.posterSubtitle}>邀请码 · {inviteCode}</Text>
            <Text style={styles.posterSubtitle}>队伍：{teamName}</Text>
            <View style={styles.posterPill}>
              <Text style={styles.posterPillText}>满 10 人 赠盲盒券 ×1</Text>
            </View>
          </View>
          <View style={styles.posterQr}>
            <Text style={styles.posterQrText}>二维码</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#050816',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#33E6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#33E6FF',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    marginLeft: 12,
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
  },
  segmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 16,
    columnGap: 8,
  },
  segmentPill: {
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#555A7A',
    overflow: 'hidden',
  },
  segmentPillActive: {
    borderColor: 'transparent',
  },
  segmentGradient: {
    flex: 1,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentText: {
    fontSize: 13,
    color: '#A9B4D8',
  },
  segmentTextActive: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  templateList: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  templateCard: {
    borderRadius: 24,
    padding: 3,
  },
  templateInner: {
    flex: 1,
    borderRadius: 21,
    overflow: 'hidden',
    backgroundColor: '#050816',
  },
  templateImage: {
    flex: 1,
  },
  templateBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  templateBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  previewLabel: {
    marginHorizontal: 16,
    marginBottom: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  previewCard: {
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 28,
    padding: 16,
    backgroundColor: '#050816',
    shadowColor: '#00E0FF',
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    elevation: 8,
  },
  ratioBadge: {
    position: 'absolute',
    top: 12,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
    zIndex: 2,
  },
  ratioBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  posterSurface: {
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
  },
  templateImageOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  posterContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  posterCopy: {
    flex: 1,
    gap: 6,
  },
  posterTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  posterSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
  posterPill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    marginTop: 6,
  },
  posterPillText: {
    color: '#FFFFFF',
    fontSize: 12,
  },
  posterQr: {
    width: 88,
    height: 88,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#33E6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  posterQrText: {
    color: '#33E6FF',
    fontSize: 12,
  },
  primaryButtonWrapper: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  primaryButton: {
    height: 48,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonWrapper: {
    marginHorizontal: 16,
    marginBottom: 8,
  },
  secondaryButton: {
    height: 44,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
    backgroundColor: 'rgba(5,8,22,0.7)',
  },
  secondaryButtonText: {
    color: '#C7D2FF',
    fontSize: 14,
  },
});

export default PosterWorkshopScreen;
