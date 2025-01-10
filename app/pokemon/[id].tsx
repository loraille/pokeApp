import { RootView } from '@/components/RootView';
import { Row } from '@/components/Row';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { useFetchQuery } from '@/hooks/useFetchQuery';
import { useThemeColors } from '@/hooks/useThemeColors';
import { router, useLocalSearchParams } from 'expo-router';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';
import { Audio } from 'expo-av';
import {
  formatHeight,
  formatWeight,
  getPokeArtwork,
  PokeDefStats,
} from '../functions/pokemon';
import { Card } from '@/components/Card';
import { PokemonType } from '@/components/pokemon/PokemonType';
import { PokemonSpec } from '@/components/pokemon/PokemonSpec';
import { PokemonStat } from '@/components/pokemon/PokemonStat';

export default function Pokemon() {
  const colors = useThemeColors();
  const params = useLocalSearchParams() as { id: string };
  const { data: pokemon } = useFetchQuery('/pokemon/[id]', { id: params.id });
  const { data: species } = useFetchQuery('/pokemon-species/[id]', {
    id: params.id,
  });
  const mainType = pokemon?.types?.[0].type.name;
  const colorType = mainType ? Colors.type[mainType] : colors.tint;
  const types = pokemon?.types ?? [];
  const bio = species?.flavor_text_entries
    ?.find(({ language }) => language.name === 'en')
    ?.flavor_text.replaceAll('\n', '. ');
  const stats = pokemon?.stats ?? PokeDefStats;
  const id = parseInt(params.id, 10);
  const isFirst = id === 1;
  const isLast = id === 151;

  const onNext = () => {
    router.replace({
      pathname: '/pokemon/[id]',
      params: { id: Math.min(id + 1, 151) },
    });
  };
  const onPrevious = () => {
    router.replace({
      pathname: '/pokemon/[id]',
      params: { id: Math.max(id - 1, 1) },
    });
  };

  const onImgPress = async () => {
    const cry = pokemon?.cries.latest;
    if (!cry) {
      return;
    }
    const { sound } = await Audio.Sound.createAsync(
      {
        uri: cry,
      },
      { shouldPlay: true }
    );
    sound.playAsync();
  };

  return (
    <RootView backgroundColor={colorType}>
      <View>
        <Image
          style={styles.pokball}
          source={require('@/assets/images/PokSil.png')}
        />
        <Row style={styles.header}>
          <Pressable onPress={router.back}>
            <Row gap={8}>
              <Image
                style={styles.back}
                source={require('@/assets/images/back.png')}
              />
              <ThemedText
                color="grayWhite"
                variant="headline"
                style={{ textTransform: 'capitalize' }}
              >
                {pokemon?.name}
              </ThemedText>
            </Row>
          </Pressable>
          <ThemedText color="grayWhite" variant="subtitle2">
            #{params.id.padStart(3, '0')}
          </ThemedText>
        </Row>

        <Card style={styles.card}>
          <Row style={styles.imgRow}>
            {isFirst ? (
              <View style={styles.imgNav}></View>
            ) : (
              <Pressable onPress={onPrevious}>
                <Image
                  style={styles.imgNav}
                  source={require('@/assets/images/prev.png')}
                />
              </Pressable>
            )}
            <Pressable onPress={onImgPress}>
              <Image
                style={styles.artwork}
                source={{ uri: getPokeArtwork(params.id) }}
              />
            </Pressable>
            {isLast ? (
              <View style={styles.imgNav}></View>
            ) : (
              <Pressable onPress={onNext}>
                <Image
                  style={styles.imgNav}
                  source={require('@/assets/images/next.png')}
                />
              </Pressable>
            )}
          </Row>
          <Row gap={16} style={{ height: 20 }}>
            {types.map((type) => (
              <PokemonType name={type.type.name} key={type.type.name} />
            ))}
          </Row>
          {/* -------------------------------------------- */}
          {/* -------------------About-------------------- */}
          {/* -------------------------------------------- */}
          <ThemedText variant="subtitle1" style={{ color: colorType }}>
            About
          </ThemedText>
          <Row style={styles.row}>
            <PokemonSpec
              style={{
                borderStyle: 'solid',
                borderRightWidth: 1,
                borderColor: colorType,
              }}
              title={formatWeight(pokemon?.weight)}
              description="Weight"
              image={require('@/assets/images/weight.png')}
            />
            <PokemonSpec
              style={{
                borderStyle: 'solid',
                borderRightWidth: 1,
                borderColor: colorType,
              }}
              title={formatHeight(pokemon?.height)}
              description="Size"
              image={require('@/assets/images/height.png')}
            />
            <PokemonSpec
              title={pokemon?.moves
                .slice(0, 2)
                .map((m) => m.move.name)
                .join('\n')}
              description="Moves"
            />
          </Row>
          <ThemedText>{bio}</ThemedText>
          {/* -------------------------------------------- */}
          {/* -------------------Stats-------------------- */}
          {/* -------------------------------------------- */}
          <ThemedText variant="subtitle1" style={{ color: colorType }}>
            Base Stats
          </ThemedText>
          <View style={{ alignSelf: 'stretch' }}>
            {stats.map((stat) => (
              <PokemonStat
                key={stat.stat.name}
                name={stat.stat.name}
                value={stat.base_stat}
                color={colorType}
              />
            ))}
          </View>
        </Card>
      </View>
    </RootView>
  );
}

const styles = StyleSheet.create({
  header: {
    margin: 20,
    justifyContent: 'space-between',
  },
  back: {
    width: 32,
    height: 32,
  },
  pokball: {
    width: 208,
    height: 208,
    opacity: 0.2,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  imgRow: {
    alignItems: 'center',
    position: 'absolute',
    top: -140,
    zIndex: 2,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    right: 0,
    left: 0,
  },
  imgNav: {
    width: 24,
    height: 24,
  },
  artwork: {
    width: 200,
    height: 200,
  },
  card: {
    marginTop: 144,
    paddingHorizontal: 20,
    paddingTop: 56,
    gap: 16,
    alignItems: 'center',
    paddingBottom: 20,
  },
  row: {
    height: 32,
    alignItems: 'center',
  },
});
