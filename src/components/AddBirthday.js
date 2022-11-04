import React,{useState} from "react";
import { StyleSheet,Text,View,TextInput,TouchableOpacity } from "react-native";
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import firebase from "../utils/firebase";
import 'firebase/firestore';

firebase.firestore().settings({});
const db=firebase.firestore(firebase);

export default function AddBirthday(props)
{
    const {user,setShowList,setReloadData} = props;
    const [formData,setFormData] = useState({});
    const [isDatePickerVisible,setIsDatePickerVisible]=useState(false);
    const [formError,setFormError]=useState({});

    const hideDatePicker=()=>{
        setIsDatePickerVisible(false);
    };

    const showDatePicker=()=>{
        setIsDatePickerVisible(true);
    };

    const handlerConfrim=(date)=>{
        const dateBirth=date;
        const newdata=(moment(dateBirth).format('YYYY-MM-DD'));
        dateBirth.setHours(0);
        dateBirth.setMinutes(0);
        dateBirth.setSeconds(0);     
        console.log(newdata);
        console.log(dateBirth);
        setFormData({...formData,dateBirth});
        hideDatePicker();
    }
    const onChange=(e,type)=>{
        setFormData({...formData,[type]:e.nativeEvent.text});
    }

    const onSubmit=()=>{
        let errors={};
        if(!formData.name||!formData.lastname||!formData.dateBirth)
        {
            if(!formData.name)
            {
                errors.name=true;
            }            
            if(!formData.lastname)
            {
                errors.lastname=true;
            }            
            if(!formData.dateBirth)
            {
                errors.dateBirth=true;
            }            
        }else
        {
            const data=formData;       
            console.log(formData);
            db.collection(user.uid)
            .add(data)
            .then(()=>{
                setReloadData(true);
                setShowList(true);
            })
            .catch(()=>{
                setFormError({name:true,lastname:true,dateBirth:true});
            })
            setFormData(errors);
        }        
    };

    return (
        <>  
            <View style={styles.container}>
                <TextInput 
                    style={[styles.input,formError.name&&{borderColor:'#940c0c'}]}
                    placeholder="Nombre"
                    placeholderTextColor="#969696"
                    onChange={(e)=>onChange(e,'name')}
                />
                <TextInput 
                    style={[styles.input,formError.lastname&&{borderColor:'#940c0c'}]}
                    placeholder="Apellidos"
                    placeholderTextColor="#969696"
                    onChange={(e)=>onChange(e,'lastname')}
                />
                <View
                style={[styles.input,styles.datepicker,formError.dateBirth&&{borderColor:'#940c0c'},]}
                >
                    <Text 
                        style={{color:formData.dateBirth ?'#fff':'#969696',fontSize:18,}}
                        onPress={showDatePicker}
                    >
                        {formData.dateBirth ?moment(formData.dateBirth).format('YYYY-MM-DD'):'Fecha de Nacimiento'}
                    </Text>
                </View>
                <TouchableOpacity onPress={onSubmit}>
                    <Text style={styles.addButton}>Crear Cumpleaños </Text>
                </TouchableOpacity>
            </View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handlerConfrim}
                onCancel={hideDatePicker}
            />
        </>
        );
}

const styles = StyleSheet.create({
    container: {
        height:'100%',
        width:'100%',
        justifyContent:'center',
        alignItems:'center',
    },
    input:{
        height:50,
        color: '#fff',
        width:'80%',
        marginBottom:25,
        backgroundColor:'#1e3040',
        paddingHorizontal:20,
        borderRadius:50,
        fontSize:18,
        borderWidth:1,
        borderColor:'#1e3040',        
    },
    datepicker:{
        justifyContent:'center',
    },
    addButton:{
        fontSize:18,
        color:'#fff',
        backgroundColor:'#1e3040',
    },
});
