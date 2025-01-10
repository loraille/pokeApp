import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import { Row } from '@/components/Row';
import { ThemedText } from '@/components/ThemedText';

type Props = ViewProps & {
  title?: string;
  description?: string;
  image?: ImageSourcePropType;
};

export function PokemonSpec({
  style,
  image,
  title,
  description,
  ...rest
}: Props) {
  return (
    <View style={[styles.root, style]} {...rest}>
      <Row>
        {image && <Image source={image} style={styles.image} />}
        <ThemedText>{title}</ThemedText>
      </Row>
      <ThemedText variant="caption" color="grayMedium">
        {description}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    gap: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 16,
    height: 16,
  },
});
