import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';


const getAllData = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem('produtos');
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.error("Erro ao ler os dados dos produtos:", e);
        return [];
    }
};

export default function SettingsScreen({ navigation }) {
    const [produtos, setProdutos] = useState([]);
    const [qrCodeImages, setQrCodeImages] = useState([]);

    useFocusEffect(
        React.useCallback(() => {
            const fetchProdutos = async () => {
                const produtosData = await getAllData();
                if (produtosData) {
                    setProdutos(produtosData);
                    generateQRCode(produtosData);
                }
            };
            fetchProdutos();
        }, [])
    );

    useEffect(() => {
        const fetchProdutos = async () => {
            const produtosData = await getAllData();
            if (produtosData) {
                setProdutos(produtosData);
                generateQRCode(produtosData);
            }
        };
        fetchProdutos();
    }, []);

    const generateQRCode = async (produtosData) => {
        try {
            const qrCodeImagesArray = [];
            for (const produto of produtosData) {
                qrCodeImagesArray.push(produto.qrCodeImage);
            }
            setQrCodeImages(qrCodeImagesArray);
        } catch (error) {
            console.error("Erro ao gerar códigos QR:", error);
        }
    };

    const chunkArray = (array, chunkSize) => {
        const chunkedArray = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunkedArray.push(array.slice(i, i + chunkSize));
        }
        return chunkedArray;
    };

    return (
        <ScrollView style={{ flex: 1 }}>
            {chunkArray(produtos, 2).map((produtoPair, index) => (
                <View key={index} style={styles.rowContainer}>
                    {produtoPair.map((produto, innerIndex) => (
                        <View key={innerIndex} style={styles.produtoContainer}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Produto:</Text>
                            <Text><Text style={{ fontWeight: 'bold' }}>ID:</Text> {produto.idProduto}</Text>
                            <Text><Text style={{ fontWeight: 'bold' }}>Nome:</Text> {produto.nomeProduto}</Text>
                            <Text><Text style={{ fontWeight: 'bold' }}>Descrição:</Text> {produto.descricao}</Text>
                            <Text><Text style={{ fontWeight: 'bold' }}>Quantidade:</Text> {produto.quantidade}</Text>
                            <Text><Text style={{ fontWeight: 'bold' }}>Preço:</Text> {produto.preco}</Text>
                            {qrCodeImages[index] && (
                                <Image
                                    source={{ uri: qrCodeImages[index] }}
                                    style={styles.qrCodeImage}
                                />
                            )}
                            <TouchableOpacity onPress={() => navigation.navigate('EditProd', { produto })} style={styles.button}>
                                <Text>Editar</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            ))}
        </ScrollView>
    );

    
}


const styles = StyleSheet.create({
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    produtoContainer: {        
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        width: '48%', 
    },
    qrCodeImage: {
        width: 100,
        height: 100,
        marginTop: 10,
    },
    button: {

        alignItems: 'center',
        backgroundColor: 'tomato',
        padding: 10,
        marginTop: 10,
        width: '80%',
    },
});
