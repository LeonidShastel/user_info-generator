import {Button, Container, Paper, TextField, Snackbar, Alert, Backdrop, CircularProgress, Box} from "@mui/material";
import {useEffect, useState} from "react";
import axios from "axios";

const Mailjs = require("@cemalgnlts/mailjs");

function App() {

    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState(null);
    const [loaded, setLoaded] = useState(false);
    const [urlDownloadFiles, setUrlDownLoadFiles] = useState({});
    const mailjs = new Mailjs();

    const createMail = () => {
        console.log('create')

    }

    const [person, setPerson] = useState({
        email: '',
        password: '',
        name: '',
        surName: '',
        patronymic: '',
        birth: '',
        randomWords: ['', '', ''],
        city: '',
        street: '',
        house: '',
        flat: '',
        index: '',
        phone: '',
    })

    const copyValue = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                setAlertMessage(text);
                setOpen(true);
            })
    }

    useEffect(() => {
        if (person.email) {
            saveFiles();
        }
    }, [person])

    const saveFiles = async (data) => {
        console.log(person);
        return await axios.post("http://thelax67.beget.tech/user_generator/saveFiles.php", person)
            .then(res => {
                setUrlDownLoadFiles(res.data);
                setLoaded(false);
            })
            .catch(error => console.log(error));
    }

    const generateMAil = async (personData) => {
        const domain = await mailjs.getDomains()
        mailjs.register(personData.name + personData.surName + '@' + domain.data[0].domain, personData.password)
            .then(res => {
                personData = {...personData, email: res.data.address};
                setPerson({...personData, email: res.data.address})
            });
    }

    const generateInfo = async () => {
        setLoaded(true);
        let personData = {};

        return await axios.get("http://thelax67.beget.tech/user_generator/getInfoPerson.php")
            .then(response => {
                const address = JSON.parse(response.data.address);
                const name = response.data.name.split(' ');
                personData = {
                    name: name[1],
                    surName: name[0],
                    patronymic: name[2],
                    birth: response.data.birth,
                    randomWords: JSON.parse(response.data.words),
                    city: address.city,
                    street: address.street,
                    house: address.house,
                    flat: address.flat,
                    index: address.index,
                    phone: response.data.phone,
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
        return retVal;
    }

    return (
        <Container component={Paper} fixed={true}>
            <Container maxWidth={"sm"} sx={{display: "flex", flexDirection: "column", padding: 2}}>
                <TextField sx={{cursor: 'pointer'}} label={"Email"} disabled={true} margin={"dense"} size={"small"}
                           onClick={e => copyValue(e.target.value)} value={person.email}/>
                <TextField sx={{cursor: 'pointer'}} label={"Пароль"} disabled={true} margin={"dense"} size={"small"}
                           onClick={e => copyValue(e.target.value)} value={person.password}/>
                <TextField sx={{cursor: 'pointer'}} label={"Имя"} disabled={true} margin={"dense"} size={"small"}
                           onClick={e => copyValue(e.target.value)} value={person.name}/>
                <TextField sx={{cursor: 'pointer'}} label={"Отчество"} disabled={true} margin={"dense"} size={"small"}
                           onClick={e => copyValue(e.target.value)} value={person.patronymic}/>
                <TextField sx={{cursor: 'pointer'}} label={"Фамилия"} disabled={true} margin={"dense"} size={"small"}
                           onClick={e => copyValue(e.target.value)} value={person.surName}/>
                <TextField sx={{cursor: 'pointer'}} label={"Дата рождения"} disabled={true} margin={"dense"}
                           size={"small"} onClick={e => copyValue(e.target.value)} value={person.birth}/>
                <TextField sx={{cursor: 'pointer'}} label={"Случайное слово 1"} disabled={true} margin={"dense"}
                           size={"small"} onClick={e => copyValue(e.target.value)} value={person.randomWords[0]}/>
                <TextField sx={{cursor: 'pointer'}} label={"Случайное слово 2"} disabled={true} margin={"dense"}
                           size={"small"} onClick={e => copyValue(e.target.value)} value={person.randomWords[1]}/>
                <TextField sx={{cursor: 'pointer'}} label={"Случайное слово 3"} disabled={true} margin={"dense"}
                           size={"small"} onClick={e => copyValue(e.target.value)} value={person.randomWords[2]}/>
                <TextField sx={{cursor: 'pointer'}} label={"Улица и дом"} disabled={true} margin={"dense"}
                           size={"small"} onClick={e => copyValue(e.target.value)}
                           value={person.street + ', ' + person.house + ', ' + person.flat}/>
                <TextField sx={{cursor: 'pointer'}} label={"Город"} value={"Moscow"} disabled={true} margin={"dense"}
                           size={"small"} onClick={e => copyValue(e.target.value)}/>
                <TextField sx={{cursor: 'pointer'}} label={"Индекс"} disabled={true} margin={"dense"} size={"small"}
                           onClick={e => copyValue(e.target.value)} value={person.index}/>
                <TextField sx={{cursor: 'pointer'}} label={"Номер телефона"} disabled={true} margin={"dense"}
                           size={"small"} onClick={e => copyValue(e.target.value)} value={person.phone}/>
                <Button variant={"contained"} onClick={generateInfo}>Сгенерировать данные</Button>
                {urlDownloadFiles.fullInfo && urlDownloadFiles.emailInfo ?
                    <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <Button variant={"outlined"}><a href={urlDownloadFiles.fullInfo} style={{textDecoration: 'none'}} download={true}>Скачать файл с полной
                            информацией</a></Button>
                        <Button variant={"outlined"}><a href={urlDownloadFiles.emailInfo} style={{textDecoration: 'none'}} download={true}>Скачать файл с информацией о
                            mail</a></Button>
                    </Box>
                    :
                    null}
            </Container>
            <Snackbar open={open} autoHideDuration={6000} onClose={() => setOpen(false)}>
                <Alert onClose={() => setOpen(false)} severity="success" sx={{width: '100%'}}>
                    Скопированный текст: {alertMessage}
                </Alert>
            </Snackbar>
            <Backdrop
                sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}
                open={loaded}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </Container>
    );
}

export default App;
