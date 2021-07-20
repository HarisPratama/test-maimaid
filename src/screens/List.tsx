import React, { useState } from 'react';
import { useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Props } from '../../App';
import instance from '../axios';

const List = ({ navigation }: Props) => {

    const [users, setUsers] = useState([])
    const [length, setLength] = useState([])
    const [currentPage, setCurrentPage] = useState(1)

    useEffect(() => {
        (async () => {
            const { data } = await instance.post('/read', { page: 1, offset: 5 })
            setUsers(data?.data?.rows)
        })()
    }, [])

    useEffect(() => {
        (async () => {
            const { data } = await instance.post('/read')
            const arr = []
            const total = data?.data?.total / 5
            for (let i = 1; i <= +total.toFixed(); i++) {
                arr.push({ number: i })
            }
            setLength(arr)
        })()
    }, [])

    const onPress = async (page: number) => {
        setCurrentPage(page)
        const { data } = await instance.post('/read', { page: page, offset: 5 })
        setUsers(data?.data?.rows)
    }

    return (
        <View style={styles.container}>
            <View>
                <Text style={{ fontSize: 20 }} >List</Text>
                <View>
                    {users && users.map(user => (
                        <TouchableOpacity
                            key={user.id}
                            style={styles.user}
                            onPress={() => navigation.navigate('Create', { userId: user.id })}
                        >
                            <View style={{ flex: 1 }} >
                                <Text>{user?.fullname}</Text>
                                <Text>{user?.email}</Text>
                            </View>
                            <View style={{ flex: 1 }} >
                                <Text>{user?.gender === 1 ? 'Pria' : 'Wanita'}</Text>
                                <Text>{user?.dob}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <View style={{ marginTop: 30 }} >
                        <ScrollView showsHorizontalScrollIndicator={false} horizontal >
                            <View style={{ backgroundColor: '#eeee', padding: 10, flexDirection: 'row' }} >
                                {length?.map(el => (
                                    <TouchableOpacity
                                        onPress={() => onPress(el.number)}
                                        key={el.number}
                                        style={{ marginLeft: el.number > 1 ? 5 : 0, padding: 10, backgroundColor: currentPage === el.number ? 'green' : '#ffff' }}
                                    >
                                        <Text style={{ color: currentPage === el.number ? '#ffff' : 'black' }}>{el.number}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>
                </View>
            </View>

            <View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Create', { userId: null })}
                    style={styles.button}
                >
                    <Text>Add User</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default List;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#c4c4c4',
        padding: 20,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    button: {
        marginTop: 20,
        backgroundColor: '#ff9901',
        padding: 20,
        borderRadius: 11
    },
    user: {
        flexDirection: 'row',
        width: Dimensions.get('screen').width - 40,
        marginTop: 20,
        padding: 20,
        borderRadius: 11,
        backgroundColor: '#ffff'
    }
});
