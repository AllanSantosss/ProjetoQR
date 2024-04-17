import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';



    export default function EditProd({ route, navigation }) {
    const [idProduto, setIdProduto] = useState('');
    const [nomeProduto, setNomeProduto] = useState('');
    const [descricao, setDescricao] = useState('');
    const [quantidade, setQuantidade] = useState('');
    const [preco, setPreco] = useState('');
    const [qrCodeImage, setQrCodeImage] = useState('');

    

    useEffect(() => {
        if (route.params && route.params.produto) {
            const produto = route.params.produto;
            setIdProduto(produto.idProduto);
            setNomeProduto(produto.nomeProduto);
            setDescricao(produto.descricao);
            setQuantidade(produto.quantidade);
            setPreco(produto.preco);
            
            setQrCodeImage(produto.qrCodeImage);
        }
    }, [route.params]);

       

    async function handleGenerateQRCode() {
        try {
            const qrCodeData = await fetch(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${idProduto} ${nomeProduto} ${descricao} ${quantidade} ${preco}`);
            const qrCodeBlob = await qrCodeData.blob();
            const reader = new FileReader();
            reader.onload = () => {
                setQrCodeImage(reader.result);
            };
            reader.readAsDataURL(qrCodeBlob);
        } catch (error) {
            console.error("Erro ao gerar código QR:", error);
        }
    }

    const storeData = async (key, value) => {
        try {
            const jsonValue = JSON.stringify(value);
            await AsyncStorage.setItem(key, jsonValue);
            
        } catch (error) {
            console.error(`Erro ao armazenar os dados`, error);
        }
    };

    const handleInsert = async () => {
        try {
            if (!idProduto || !nomeProduto || !descricao || !quantidade || !preco || !qrCodeImage) {
                console.error("Todos os campos devem ser preenchidos.");
                return;
            }
            
            const produtoData = await AsyncStorage.getItem('produtos');
            let produtos = [];
            if (produtoData) {
                produtos = JSON.parse(produtoData);
            }
            // Adicionar o novo produto à lista de produtos
            const novoProduto = {
                idProduto: idProduto,
                nomeProduto: nomeProduto,
                descricao: descricao,
                quantidade: quantidade,
                preco: preco,
                qrCodeImage: qrCodeImage
            };
            produtos.push(novoProduto);
            // Armazenar a lista atualizada de produtos no AsyncStorage
            await storeData('produtos', produtos);
            console.log("Novo produto inserido com sucesso.");
            setIdProduto('');
            setNomeProduto('');
            setDescricao('');
            setQuantidade('');
            setPreco('');
            setQrCodeImage('');
        } catch (error) {
            console.error("Erro ao inserir o novo produto:", error);
        }
    };


    const handleSearch = async () => {
        try {
            if (idProduto) {
                const produtosData = await AsyncStorage.getItem('produtos');
                if (produtosData) {
                    const produtos = JSON.parse(produtosData);
                    const produto = produtos.find(p => p.idProduto === idProduto);
                    if (produto) {
                        setNomeProduto(produto.nomeProduto);
                        setDescricao(produto.descricao);
                        setQuantidade(produto.quantidade);
                        setPreco(produto.preco);
                        setQrCodeImage(produto.qrCodeImage);
                    } else {
                        console.error("Produto não encontrado.");
                    }
                } else {
                    console.error("Nenhum produto encontrado.");
                }
            } else {
                console.error("Por favor, preencha o ID do produto.");
            }
        } catch (error) {
            console.error("Erro ao buscar produto:", error);
        }
    };

    const handleUpdate = async (idProduto) => {
        try {
            if (!idProduto) {
                console.error("ID do produto não especificado.");
                return;
            }

            const produtosData = await AsyncStorage.getItem('produtos');
            if (produtosData !== null) {

                let produtos = JSON.parse(produtosData);

                const produtoAtualizado = produtos.map(produto => {
                    if (produto.idProduto === idProduto) {
                        return {
                            ...produto,
                            idProduto: idProduto,
                            nomeProduto: nomeProduto,
                            descricao: descricao,
                            quantidade: quantidade,
                            preco: preco,
                            qrCodeImage: qrCodeImage
                        };
                    }
                    return produto;
                });

                await AsyncStorage.setItem('produtos', JSON.stringify(produtoAtualizado));
                console.log("Dados do produto atualizados com sucesso.");
                setIdProduto('');
                setNomeProduto('');
                setDescricao('');
                setQuantidade('');
                setPreco('');
                setQrCodeImage('');
            } else {
                console.error("Nenhum produto encontrado para atualizar.");
            }
        } catch (error) {
            console.error("Erro ao atualizar dados no AsyncStorage:", error);
        }
    };


    const handleDelete = async (idProduto) => {
        Alert.alert(
            "Excluir Produto",
            "Tem certeza de que deseja excluir este produto?",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Cancelado"),
                    style: "cancel"
                },
                { 
                    text: "OK", 
                    onPress: async () => {
                        try {
                            if (!idProduto) {
                                console.error("ID do produto não especificado.");
                                return;
                            }
                
                            const produtosData = await AsyncStorage.getItem('produtos');
                            if (produtosData !== null) {
                                const produtos = JSON.parse(produtosData);
                    
                                const produtosRestantes = produtos.filter(produto => produto.idProduto !== idProduto);
                    
                                await AsyncStorage.setItem('produtos', JSON.stringify(produtosRestantes));
                                console.log("Produto excluído com sucesso.");
                    
                                setIdProduto('');
                                setNomeProduto('');
                                setDescricao('');
                                setQuantidade('');
                                setPreco('');
                                setQrCodeImage('');
                            } else {
                                console.error("Nenhum produto encontrado para excluir.");
                            }
                        } catch (error) {
                            console.error("Erro ao excluir produto do AsyncStorage:", error);
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Id"
                value={idProduto}
                onChangeText={setIdProduto}
                style={styles.input}
            />
            <TextInput
                placeholder="Nome do Produto"
                value={nomeProduto}
                onChangeText={setNomeProduto}
                style={styles.input}
            />
            <TextInput
                placeholder="Descrição"
                value={descricao}
                onChangeText={setDescricao}
                style={styles.input}
            />
            <TextInput
                placeholder="Quantidade"
                value={quantidade}
                onChangeText={setQuantidade}
                style={styles.input}
            />
            <TextInput
                placeholder="Preço"
                value={preco}
                onChangeText={setPreco}
                style={styles.input}
            />
            <TouchableOpacity onPress={handleGenerateQRCode} style={styles.button}>
                <Text>Gerar QR Code</Text>
            </TouchableOpacity>
            {qrCodeImage && (
                <Image
                    source={{ uri: qrCodeImage }}
                    style={{ width: 100, height: 100 }}
                />
            )}

            <TouchableOpacity onPress={handleSearch} style={styles.button}>
                <Text>Buscar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleInsert} style={styles.button}>
                <Text>Inserir</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleUpdate(idProduto)} style={styles.button}>
                <Text>Alterar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(idProduto)} style={styles.button}>
                <Text>Excluir</Text>
            </TouchableOpacity>
        </View>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',

    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        padding: 10,
        width: '80%',
    },
    button: {
        alignItems: 'center',
        backgroundColor: 'tomato',
        padding: 10,
        marginBottom: 10,
        width: '80%',
    },
});