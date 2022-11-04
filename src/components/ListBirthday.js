import React,{useState,useEffect} from 'react';
import { StyleSheet,View,ScrollView,Alert } from 'react-native';
import moment from 'moment';
import AddBirthday from './AddBirthday';
import ActionBar from './ActionBar';
import Birthday from './Birthday';
import firebase from '../utils/firebase';
import 'firebase/firestore';

firebase.firestore().settings({experimentalForceLongPolling: true});
const db=firebase.firestore(firebase);

export default function ListBirthday(props)
{
    const {user}=props;
    const [birthday,setBirthday] = useState([]);
    const [showList,setShowList] = useState(true);
    const [pasatBirthday,setPasatBirthday] = useState([]);
    const [reloadData,setReloadData] = useState(false);

    useEffect(() => {
        setBirthday([]);
        setPasatBirthday([]);
        db.collection(user.uid)
        .orderBy('dateBirth','asc')
        .get()
        .then((response)=>{
            const itemsArray=[];
            response.forEach((doc)=>{
                const data=doc.data();
                data.id=doc.id;
                itemsArray.push(data);
            })
            formatData(itemsArray);
        });
        setReloadData(false);
        },[reloadData]);

    const formData=(items)=>{

        const currentDate=moment().set({
            hour:0,
            minute:0,
            second:0,
            millisecond:0,
        });

        const birthdayTempArray=[];
        const pasatBirthdayTempArray=[];

        items.forEach((item)=>{
            
            const dateBirth=new Date(item.dateBirth.seconds*1000);
            const dateBirthday=moment(dateBirth);
            const currentYear=moment().get('year');
            dateBirthday.set({year:currentYear});

            const diffDate=currentDate.diff(dateBirthday,'days');
            const itemTemp=item;
            itemTemp.dateBirth=dateBirthday;
            itemTemp.days=diffDate;

            if(diffDate<=0)
            {
                birthdayTempArray.push(itemTemp);
            }else
            {
                pasatBirthdayTempArray.push(itemTemp);
            }
        })

        setBirthday(birthdayTempArray);
        setPasatBirthday(pasatBirthdayTempArray);
    }

    const deleteBirthday=(birthday)=>{
        Alert.alert(
            'Eliminar cumpleaños',
            `¿Estás seguro de eliminar el cumpleaños de ${birthday.name} ${birthday.lastname}?`,
            [
                {
                    text: 'Cancelar',
                    style:'cancel'
                    
                },
                {
                    text:'Eliminar',
                    onPress:()=>{
                        db.collection(user.uid)
                        .doc(birthday.id)
                        .delete()
                        .then(()=>{
                            setReloadData();
                        })
                    }
                }
            ],
            {
                cancelable:false,                
            }        
        )
    }

    return(
        <View style={styles.container}>
            {showList?(
                <ScrollView style={styles.scrollView}>
                    {
                        birthday.map((item, index)=>(
                        <Birthday
                            key={index}
                            birthday={item}
                            deleteBirthday={deleteBirthday}
                        />
                        ))
                    }
                    {
                        pasatBirthday.map((item, index)=>(
                        <Birthday
                            key={index}
                            birthday={item}
                            deleteBirthday={deleteBirthday}
                        />
                        ))
                    }
                </ScrollView>
            ):(
                <AddBirthday
                    user={user}
                    setShowList={setShowList}
                    setReloadData={setReloadData}
                />
            )}
            <ActionBar showList={showList} setShowList={setShowList}/>
        </View>            
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        height: '100%',
    },
    scrollView: {
        marginBottom: 50,
        width:'100%',
    },
});