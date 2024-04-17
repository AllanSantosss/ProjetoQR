import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Camera } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DetailsScreen() {
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [productFound, setProductFound] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const askForCameraPermission = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        askForCameraPermission();
    }, []);

    const handleBarCodeScanned = ({ type, data }) => {
        const [idProduto] = data.split(' ');
        checkProductExists(idProduto).then(produto => {
            setScanned(true);
            setProductFound(!!produto);
        
            if (produto) {
                navigation.navigate('EditProd', { produto });
            }
        });
    };
    
    const checkProductExists = async (idProduto) => {
        try {
            const produtoData = await AsyncStorage.getItem('produtos');
            let produtos = [];
            if (produtoData) {
                produtos = JSON.parse(produtoData);
            }
            
            const produto = produtos.find(produto => produto.idProduto === idProduto);
            return produto;
        } catch (error) {
            console.log(error);
        }
        return null;
    };
    
    return (
        <View style={styles.container}>
            <View style={styles.barcodeContainer}>
                <Camera
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={StyleSheet.absoluteFillObject} />
            </View>
            {scanned && !productFound && <Text>Produto não encontrado</Text>}
            {scanned && <Button title={'Escanear outra vez?'} onPress={() => setScanned(false)} />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    barcodeContainer: {
        height: 300,
        width: 300,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
});
