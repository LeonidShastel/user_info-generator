import {
    Button,
    Container,
    Paper,
    TextField,
    Backdrop,
    CircularProgress,
    Box,
    Typography,
    Stack,
} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "axios";
import {CopyToClipboard} from "react-copy-to-clipboard/lib/Component";
import {db} from './firebase';
import {collection, getDoc, getDocs, addDoc} from "firebase/firestore";
import Mailjs from "@cemalgnlts/mailjs";

const mailjs = new Mailjs();

function App() {

    const [loaded, setLoaded] = useState(false);
    const [timerRequestMail, setTimerRequestMail] = useState(0);
    const [code, setCode] = useState('');

    let interval;
    const phoneCodes = [910, 915, 916, 917, 919, 985, 986, 903, 905, 906, 909, 962, 963, 964, 965, 966, 967, 968, 969, 980, 983, 986, 925, 926, 929, 936, 999, 901, 958, 977, 999, 995, 996, 999]

    const [person, setPerson] = useState({
        email: '',
        password: '',
        name: '',
        surName: '',
        birth: '',
        randomWords: ['', '', ''],
        city: '',
        street: '',
        house: '',
        flat: '',
        index: '',
        phone: '',
    })

    const copyValue = (field, index = null) => {
        const text = index === null ? person[field] : person[field][index];
        const textField = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    }

    const saveFiles = async () => {
        const firebaseCollection = collection(db, "data");
        await addDoc(firebaseCollection, {email: person.email, password: person.password})
        await axios.post("https://heloptop.ru/php/saveFiles.php", {
            "birth": person.birth,
            "city": person.city,
            "email": person.email,
            "index": person.index,
            "name": person.name,
            "password": person.password,
            "phoneCode": person.phoneCode,
            "phone": person.phone,
            "randomWords": person.randomWords,
            "address": person.address,
            "surName": person.surName,
        })
    }

    const createIntervalRequestMail = (email) => {
        setTimerRequestMail(0);
        interval = setInterval(() => {
            mailjs.getMessages()
                .then(response => {
                    if (Object.keys(response.data).length > 0) {
                        clearInterval(interval);
                        interval = null;
                        console.log(response)
                        mailjs.getMessage(response.data[0].id)
                            .then(response => {
                                console.log(response)
                                const text = response.data.text;
                                const index = text.search(/\d/);
                                let code = '';
                                for (let i = index; i < text.length; i++)
                                    if (Number.isInteger(+text[i])) {
                                        code += text[i]
                                    } else {
                                        break;
                                    }
                                setCode(code);
                            }).catch(function (error) {
                            console.error(error);
                        });
                    }
                })
            setTimerRequestMail(prevState => +prevState + 20000);
            if (timerRequestMail >= 3600000) {
                clearInterval(interval);
                interval = null;
            }
        }, 20000)
    }

    const generateMAil = async (personData) => {
        setCode('');
        mailjs.getDomains()
            .then(response => {
                console.log(response, response.data[0].domain)
                mailjs.register(personData.name + personData.surName + Math.floor(Math.random() * 10) + "@" + response.data[0].domain, personData.password)
                    .then(mail => {
                        personData = {...personData, email: mail.data.address};
                        setPerson({...personData, email: mail.data.address});
                        setLoaded(false);
                        return personData;
                    })
                    .then((person) => {
                        mailjs.login(person.email, person.password)
                            .then(console.log)
                    })
            });
    }

    const generateInfo = async () => {
        setLoaded(true);
        let personData = {};

        return await axios.get("https://heloptop.ru/php/getInfoPerson.php")
            .then(response => {
                const address = JSON.parse(response.data.address);
                const name = response.data.name.split(' ');
                personData = {
                    name: name[1],
                    surName: name[0],
                    birth: response.data.birth.slice(-4),
                    randomWords: JSON.parse(response.data.words),
                    city: address.city,
                    address: address.street + ', ' + address.house + ', ' + address.flat,
                    index: address.index,
                    phoneCode: phoneCodes[Math.floor(Math.random() * phoneCodes.length)],
                    phone: response.data.phone.slice(-7),
                    password: generatePassword(),
                }
            })
            .then(() => {
                generateMAil(personData);
            })
            .catch(error => console.log(error));
    }

    function generatePassword() {
        const length = 10,
            charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let retVal = "";
        for (let i = 0, n = charset.length; i < length; i++) {
            let char = charset.charAt(Math.floor(Math.random() * n));
            if (i > 0 && char === retVal[i - 1]) {
                i--;
                continue;
            }
            retVal += char;
        }
        return retVal + 1 + 'a' + 'J';
    }

    return (
        <Container component={Paper} fixed={true} sx={{display: 'flex'}}>
            <Container sx={{flexShrink: 2}}>
                <Container maxWidth={"sm"} sx={{display: "flex", flexDirection: "column", padding: 2}}>
                    <Button variant={"contained"} onClick={generateInfo} sx={{marginBottom: 1}}>Сгенерировать
                        данные</Button>
                    <Button variant={"contained"} onClick={() => createIntervalRequestMail(person.email)}
                            disabled={person.email === ''} sx={{marginBottom: 1}}>Запуск поиска сообщений</Button>
                    <Button variant={"contained"} onClick={saveFiles} disabled={person.email === ''}>Сохранить данные на
                        сервере</Button>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TextField sx={{cursor: 'pointer'}} label={"Email"} margin={"dense"}
                                   size={"small"}
                                   value={person.email}/>
                        <Button onClick={e => copyValue('email')} variant={"outlined"}>Скопировать email</Button>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TextField sx={{cursor: 'pointer'}} label={"Пароль"} margin={"dense"}
                                   size={"small"}
                                   value={person.password}/>
                        <Button onClick={e => copyValue('password')} variant={"outlined"}>Скопировать пароль</Button>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TextField sx={{cursor: 'pointer'}} label={"Имя"} argin={"dense"}
                                   size={"small"}
                                   value={person.name}/>
                        <Button onClick={e => copyValue('name')} variant={"outlined"}>Скопировать имя</Button>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TextField sx={{cursor: 'pointer'}} label={"Фамилия"} margin={"dense"}
                                   size={"small"} value={person.surName}/>
                        <Button onClick={e => copyValue('surName')} variant={"outlined"}>Скопировать фамилию</Button>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TextField sx={{cursor: 'pointer'}} label={"Год рождения"} margin={"dense"}
                                   size={"small"} value={person.birth}/>
                        <Button onClick={e => copyValue('birth')} variant={"outlined"}>Скопировать год рождения</Button>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TextField sx={{cursor: 'pointer'}} label={"Случайное слово 1"} margin={"dense"}
                                   size={"small"} value={person.randomWords[0]}/>
                        <Button onClick={e => copyValue('randomWords', 0)} variant={"outlined"}>Скопировать
                            слово 1</Button>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TextField sx={{cursor: 'pointer'}} label={"Случайное слово 2"} margin={"dense"}
                                   size={"small"} value={person.randomWords[1]}/>
                        <Button onClick={e => copyValue('randomWords', 1)} variant={"outlined"}>Скопировать
                            слово 2</Button>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TextField sx={{cursor: 'pointer'}} label={"Случайное слово 3"} margin={"dense"}
                                   size={"small"} value={person.randomWords[2]}/>
                        <Button onClick={e => copyValue('randomWords', 2)} variant={"outlined"}>Скопировать
                            слово 3</Button>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TextField sx={{cursor: 'pointer'}} label={"Улица и дом"} margin={"dense"}
                                   size={"small"}
                                   value={person.address}/>
                        <Button onClick={e => copyValue('address')} variant={"outlined"}>Скопировать адрес</Button>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TextField sx={{cursor: 'pointer'}} label={"Город"} value={"Moscow"}
                                   margin={"dense"}
                                   size={"small"}/>
                        <Button onClick={e => copyValue('city')} variant={"outlined"}>Скопировать город</Button>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TextField sx={{cursor: 'pointer'}} label={"Индекс"} margin={"dense"}
                                   size={"small"}
                                   value={person.index}/>
                        <Button onClick={e => copyValue('index')} variant={"outlined"}>Скопировать индекс</Button>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TextField sx={{cursor: 'pointer'}} label={"Код телефона"} margin={"dense"}
                                   size={"small"} value={person.phoneCode}/>
                        <Button onClick={e => copyValue('phoneCode')} variant={"outlined"}>Скопировать код
                            оператора</Button>
                    </Box>
                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                        <TextField sx={{cursor: 'pointer'}} label={"Номер телефона"} margin={"dense"}
                                   size={"small"} value={person.phone}/>
                        <Button onClick={e => copyValue('phone')} variant={"outlined"}>Скопировать номер
                            телефона</Button>
                    </Box>
                </Container>
                <Backdrop
                    sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                    open={loaded}
                >
                    <CircularProgress color="inherit"/>
                </Backdrop>
            </Container>
            <Container component={Paper} fixed={true} sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flexShrink: 3,
            }}>
                <Typography variant={'h6'} color={'#1976D2'}>Письма {person.email}</Typography>
                <Stack spacing={1}>
                    {code.length > 0 ?
                        <>
                            <Paper variant="outlined" square
                                   sx={{padding: 1, display: 'flex', flexDirection: "column", alignItems: "center"}}>
                                <Typography sx={{marginBottom: 1}}>Код: {code}</Typography>
                                <CopyToClipboard text={code}>
                                    <Button variant={"outlined"}>Скопировать код</Button>
                                </CopyToClipboard>
                            </Paper>
                        </> : <Typography>Писем пока нет</Typography>

                    }
                </Stack>
            </Container>
        </Container>
    );
}

export default App;
