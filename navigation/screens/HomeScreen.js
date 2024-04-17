import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
    return (
        <View style={styles.container}>
            <View style={styles.squareContainer}>
                <Text style={styles.title}>CONTROLE DE ESTOQUE</Text>
            </View>            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff', 
        
    },
    squareContainer: {
        width: '80%',
        aspectRatio: 1, 
        borderBlockColor: 'black',
        borderRadius: 35,
        backgroundColor: 'tomato',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
    },
    title: {
        textAlign: 'center',
        alignItems: 'center',
        fontSize: 44,
        fontWeight: 'bold',
        color: '#000',
    },
    
});
