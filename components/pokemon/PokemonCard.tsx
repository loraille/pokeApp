import {
  Image,
  type ViewStyle,
  StyleSheet,
  View,
  Pressable,
} from 'react-native';
import { Card } from '../Card';
import { ThemedText } from '@/components/ThemedText';
import { useThemeColors } from '@/hooks/useThemeColors';
import { Link } from 'expo-router';
import { getPokeArtwork } from '@/app/functions/pokemon';

type Props = {
  style?: ViewStyle;
  id: number;
  name: string;
};

export default function PokemonCard({ style, name, id }: Props) {
  const colors = useThemeColors();
  return (
    <Link href={{ pathname: '/pokemon/[id]', params: { id: id } }} asChild>
      <Pressable
        style={style}
        android_ripple={{ color: colors.tint, foreground: true }}
      >
        <Card style={[styles.card]}>
          <ThemedText style={styles.pokId} variant="caption" color="grayMedium">
            #{id.toString().padStart(3, '0')}
          </ThemedText>
          <Image
            style={styles.image}
            source={{
              uri: getPokeArtwork(id),
            }}
            width={72}
            height={72}
          />
          <View
            style={[styles.shadow, { backgroundColor: colors.grayBackground }]}
          />
          <ThemedText>{name}</ThemedText>
        </Card>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    alignItems: 'center',
    padding: 4,
  },
  pokId: {
    alignSelf: 'flex-end',
  },
  image: {
    width: 72,
    height: 72,
  },
  shadow: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    left: 0,
    height: 44,
    zIndex: -1,
    borderRadius: 7,
  },
});
