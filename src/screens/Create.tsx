import React, { useEffect } from 'react';
import { useState } from 'react';
import { Dimensions } from 'react-native';
import { Text, View, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Props } from '../../App';
import DateTimePicker from '@react-native-community/datetimepicker';
import { showMessage } from 'react-native-flash-message';
import instance from '../axios';

export interface FormVal {
    fullname: string,
    email: string,
    password: string,
    confirmPassword: string,
    gender: number,
    dob: string
}

const Create = ({ navigation, route }: Props) => {
    const [form, setForm] = useState({} as FormVal)
    const { userId } = route.params

    const [dropDown, setDropDown] = useState(false)
    const [datePicker, setDatePicker] = useState(false)
    const [matchedPassword, setMatchedPassword] = useState('')
    const [check, setCheck] = useState(false)
    const [date, setDate] = useState(new Date())

    useEffect(() => {
        (async () => {
            if (userId) {
                const { data } = await instance.post('view', { id: userId })
                setForm({ ...data.data, password: '' })
            }
        })()
    }, [])

    const onChange = (event: any, selectedDate: any) => {
        const currentDate = selectedDate || date;
        const toDate = new Date(currentDate)
        const day = String(toDate.getDate()).length === 1 ? `0${toDate.getDate()}` : toDate.getDate()
        const month = String(toDate.getMonth()).length === 1 ? `0${toDate.getMonth() + 1}` : toDate.getMonth() + 1
        const year = toDate.getFullYear()
        setDate(currentDate)

        setForm({ ...form, dob: `${year}-${month}-${day}` })
        setDatePicker(false)
    };

    const create = async (fullname: string, email: string, password: string, gender: number, dob: string) => {
        try {
            const mailFormtat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            const letters = /^[a-z][a-z\s]*$/i
            const lettersNumbers = /^[0-9a-zA-Z]+$/

            const body = {
                fullname,
                email,
                password,
                gender,
                dob
            }

            if (letters.test(fullname) === false || fullname?.length < 3 || !fullname) throw { message: 'Only letters, at least 3 characters' }
            if (mailFormtat.test(email) === false || !email) throw { message: 'You have entered an invalid email address!' }
            if (lettersNumbers.test(password) === false || !password || password?.length < 6) throw { message: 'Must have numbers and letters, at least 6 characters' }
            if (!gender) throw { message: 'Select your gender' }
            if (!check) throw { message: 'Check if you agree' }
            if (matchedPassword !== 'Password Matched') throw { message: 'Password must be matched' }



            await instance.post('/create', body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            showMessage({
                type: 'success',
                message: 'Sucess create user'
            })
            navigation.navigate('List')
        } catch (error) {
            showMessage({
                type: 'warning',
                message: 'Oops! something error',
                description: error.message
            })
        }
    }

    const update = async (fullname: string, email: string, password: string, gender: number, dob: string) => {
        try {

            const mailFormtat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
            const letters = /^[a-z][a-z\s]*$/i
            const lettersNumbers = /^[0-9a-zA-Z]+$/

            const body = {
                id: userId,
                fullname,
                email,
                password,
                gender,
                dob
            }
            console.log(body, "<< body");


            if (letters.test(fullname) === false || fullname?.length < 3 || !fullname) throw { message: 'Only letters, at least 3 characters' }
            if (mailFormtat.test(email) === false || !email) throw { message: 'You have entered an invalid email address!' }
            if (lettersNumbers.test(password) === false || !password || password?.length < 6) throw { message: 'Must have numbers and letters, at least 6 characters' }
            if (!gender) throw { message: 'Select your gender' }
            if (!check) throw { message: 'Check if you agree' }
            if (matchedPassword !== 'Password Matched') throw { message: 'Password must be matched' }



            await instance.post('/update', body, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            showMessage({
                type: 'success',
                message: 'Sucess create user'
            })
            navigation.navigate('List')
        } catch (error) {
            showMessage({
                type: 'warning',
                message: 'Oops! something error',
                description: error.message
            })
        }
    }

    const onChangeConfirmPassword = (val: string) => {
        setForm({ ...form, confirmPassword: val })
        if (val === form.password) setMatchedPassword('Password Matched')
        else setMatchedPassword('Password not matched')
    }

    return (
        <View style={styles.container}>
            <View>
                <Text>Create</Text>
                <View style={{ marginTop: 20 }} >
                    <TextInput
                        style={styles.form}
                        placeholder="Full Name"
                        placeholderTextColor="#c4c4c4"
                        value={form?.fullname}
                        onChangeText={val => setForm({ ...form, fullname: val })}
                    />
                    <TextInput
                        style={styles.form}
                        placeholder="Email"
                        placeholderTextColor="#c4c4c4"
                        value={form?.email}
                        onChangeText={val => setForm({ ...form, email: val })}
                    />
                    <TextInput
                        style={styles.form}
                        placeholder="Password"
                        placeholderTextColor="#c4c4c4"
                        value={form?.password}
                        onChangeText={val => setForm({ ...form, password: val })}
                        secureTextEntry
                    />
                    <View style={{ paddingVertical: 20 }} >
                        {matchedPassword.length > 0 && (
                            <Text style={{ color: matchedPassword === 'Password Matched' ? 'green' : 'red' }} >{matchedPassword}</Text>
                        )}
                    </View>
                    <TextInput
                        style={styles.form}
                        placeholder="Confirm Password"
                        placeholderTextColor="#c4c4c4"
                        value={form?.confirmPassword}
                        onChangeText={val => onChangeConfirmPassword(val)}
                        secureTextEntry
                    />
                    <TouchableOpacity
                        onPress={() => setDropDown(dropDown ? false : true)}
                        style={styles.form}
                    >
                        <Text style={{ color: 'black' }} >-- {form?.gender ? form.gender === 1 ? 'Pria' : 'Wanita' : "Gender"} --</Text>
                    </TouchableOpacity>
                    <View>
                        {dropDown && (
                            <View style={{ position: 'absolute', width: Dimensions.get('screen').width - 40, zIndex: 999, top: 0, left: 0, backgroundColor: '#eeee', padding: 10 }} >
                                <TouchableOpacity
                                    onPress={() => {
                                        setForm({ ...form, gender: 1 })
                                        setDropDown(false)
                                    }}
                                    style={{ borderWidth: 1, borderColor: '#c4c4c4', padding: 5 }}
                                >
                                    <Text>Pria</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => {
                                        setForm({ ...form, gender: 2 })
                                        setDropDown(false)
                                    }}
                                    style={{ borderWidth: 1, borderColor: '#c4c4c4', padding: 5, marginTop: 10 }}
                                >
                                    <Text>Wanita</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity
                        style={[styles.form, { justifyContent: 'space-between', flexDirection: 'row' }]}
                        onPress={() => setDatePicker(true)}
                    >
                        <Text>Date of birth</Text>
                        <Text>{form?.dob}</Text>
                    </TouchableOpacity>
                    <View>
                        {datePicker && (
                            <DateTimePicker
                                testID="dateTimePicker"
                                value={date}
                                mode='date'
                                is24Hour={true}
                                display="default"
                                onChange={onChange}
                                onTouchEnd={() => console.log('end')}
                            />
                        )}
                    </View>
                    <View style={{ flexDirection: 'row', marginTop: 20, alignItems: 'center' }} >
                        <TouchableOpacity
                            onPress={() => setCheck(check ? false : true)}
                            style={{ width: 20, height: 20, borderRadius: 20 / 2, backgroundColor: check ? 'green' : '#eeee' }}
                        />
                        <Text style={{ marginLeft: 20 }} >Agree</Text>
                    </View>
                </View>
            </View>
            <View>
                <TouchableOpacity
                    onPress={() => userId ? update(form.fullname, form.email, form.password, form.gender, form.dob) : create(form.fullname, form.email, form.password, form.gender, form.dob)}
                    style={styles.button}
                >
                    <Text>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Create;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffff',
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
    form: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'rgba(238,238,238,0.3)',
        width: Dimensions.get('screen').width - 40,
        borderRadius: 11,
        color: 'black'
    }
});
