import {
	Button,
	Container,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	TextField,
	Typography,
} from "@mui/material";
import React, { useState } from "react";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import multiWrite from "../AWS/batchTable";

export default function DynamoImport() {
	const [targetTableName, setTargetTableName] = useState("");
	const [currentFileName, setCurrentFileName] = useState("");
    const [region, setRegion] = useState("")
    const [accessKeyId, setAccessKeyId] = useState("")
    const [secretAccessKey, setSecretAccessKey] = useState("")
    const [data, setData] = useState()

	const handleSubmit = () => {
        let endpoint = region === "localhost";
        console.log(data)
        if( targetTableName && currentFileName && region && accessKeyId && secretAccessKey && data) {
            multiWrite(targetTableName, data, region, accessKeyId, secretAccessKey, endpoint, (err) => {
                if(err) console.log(err);
            })
            setTargetTableName("")
            setRegion("")
            setAccessKeyId("")
            setSecretAccessKey("")

        } else {
            console.log('field missing')
        }
	};

    const handleFile = (e) => {
        setCurrentFileName(e.target.files[0].name)
        const fileReader = new FileReader()
        fileReader.readAsText(e.target.files[0], "UTF-8")
        fileReader.onload = e => {  
            setData(JSON.parse(e.target.result, null, 2))
        }
    }

	return (
		<Container>
			<Grid container justifyContent="center" alignItems="center" spacing={2}>
				<Grid item xs={12} align="center">
					<Typography variant="h5">Import data to DynamoDB</Typography>
				</Grid>
				<Grid item xs={6} align="end">
					<TextField
						label="Target Table Name"
						value={targetTableName}
						onChange={(e) => setTargetTableName(e.target.value)}
					/>
				</Grid>
				<Grid item xs={6}>
					<Button
						variant="contained"
						component="label"
						startIcon={<FileUploadIcon />}
					>
						Upload{" "}
						<input
							type="file"
							accept="application/json"
							onChange={handleFile}
							hidden
						/>
					</Button>
				</Grid>
				<Grid item xs={12} align="center">
					{currentFileName}
				</Grid>
                <Grid item xs={12} align="center">
					<TextField
						label="Region"
						value={region}
                        helperText='"localhost" => run server at "http://localhost:8000"'
						onChange={(e) => setRegion(e.target.value)}
					/>
				</Grid>
                <Grid item xs={12} align="center">
					<TextField
						label="Access Key Id"
						value={accessKeyId}
						onChange={(e) => setAccessKeyId(e.target.value)}
					/>
				</Grid>
                <Grid item xs={12} align="center">
					<TextField
						label="Secret Access Key"
						value={secretAccessKey}
						onChange={(e) => setSecretAccessKey(e.target.value)}
					/>
				</Grid>
				<Grid item xs={12} align="end">
					<Button variant="contained" onClick={handleSubmit}>
						Submit
					</Button>
				</Grid>
			</Grid>
		</Container>
	);
}
