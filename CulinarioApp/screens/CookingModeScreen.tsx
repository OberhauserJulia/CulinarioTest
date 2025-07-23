import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';

// Imports Compponents
import SmallButton from '../components/SmallButton';
import BigButton from '../components/BigButton';
import StepIngredientItem from '../components/StepIngredientItem';

export default function CookingModeScreen() {
    return (
        <View style={styles.container}>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <StatusBar style="light" />

                {/* Top Bar */}
                <View style={styles.topBar}>
                    <SmallButton back={true} />
                    <SmallButton dots={true} />
                </View>

                <View style={styles.stepNumber}>
                    <Text style={styles.textH1}> 1. Schritt </Text>
                </View>

                <Text style={styles.textBody}>Erhitze die Butter, Knoblauchzehen, Oregano, Pfeffer, Salz, geräuchertes Paprikapulver sowie in einer großen Pfanne oder einem Topf bei mittlerer Hitze. Koche alles etwa 2 Minuten, bis der Knoblauch duftet. Zerbrösele den Tofu in die Pfanne und brate ihn 5 bis 10 Minuten, bis er gebräunt ist. </Text>

                <View style={styles.ingredientContainer}>
                    <StepIngredientItem />
                    <StepIngredientItem />
                    <StepIngredientItem />
                    <StepIngredientItem />
                </View>
            </ScrollView>

            

            {/* Fixed Big Button */}
            <View style={styles.fixedButtonContainer}>
                <BigButton forward={true} />
                <BigButton forward={true} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#FFFFFF',
    },

    scrollContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 24,
        backgroundColor: '#161616',
        padding: 24,
        paddingTop: 68,
    },

    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    stepNumber: {
        backgroundColor: '#66A182',
        padding: 6,
        alignContent: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        alignSelf: 'flex-start',
    },

    ingredientContainer: {
        backgroundColor: '#222222',
        padding: 6,
        borderRadius: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },

    fixedButtonContainer: {
        position: 'absolute',
        bottom: 24,
        left: 0,
        right: 0,
        paddingLeft: 24,
        paddingRight: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 24,
        width: '100%',
    },

    textH1: {
        color: '#FFFFFF',
        fontFamily: 'Montserrat',
        fontSize: 24,
        fontWeight: 'bold',
    },

    textBody: {
        color: '#FFFFFF',
        fontFamily: 'Inter',
        fontSize: 16,
        fontWeight: 'medium',
        lineHeight: 25,
    },
});