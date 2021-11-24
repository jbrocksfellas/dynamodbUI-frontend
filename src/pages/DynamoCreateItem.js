import { Button, Container, FormControl, Grid, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

export default function DynamoCreateItem() {
    const [tableName, setTableName] = useState("")
    const [currentAttributeName, setCurrentAttributeName] = useState("")
    const [currentAttributeType, setCurrentAttributeType] = useState("S")
    const [currentListAttribute, setCurrentListAttribute] = useState([])
    const [currentMapAttribute, setCurrentMapAttribute] = useState({})

    const handleAttribute = () => {
        if (currentAttributeType === "L") {
            handleListAttribute();
        } else if (currentAttributeType === "M") {
            handleMapAttribute();
        }
        else console.log('other')

    }

    const handleListAttribute = () => {
        console.log('list')
        setCurrentListAttribute()
    }
    const handleMapAttribute = () => {
        console.log('map')
    }

	return (
		<Container>
			<Grid container justifyContent="center" alignItems="center" spacing={2}>
				<Grid item xs={12} align="center">
					<Typography variant="h5">Import Table</Typography>
				</Grid>
                <Grid item xs={12} align="center">
                    <TextField
                    label="Table Name"
                    value={tableName}
                    onChange={e => setTableName(e.target.value)}
                    required
                    />
                </Grid>
                <Grid item xs={4} align="end">
                    <TextField
                    label="Attribute Name"
                    value={currentAttributeName}
                    onChange={e => setCurrentAttributeName(e.target.value)}
                    />
                </Grid>
                <Grid item xs={4}>
        <FormControl>
            <InputLabel id="first-type">Type</InputLabel>
            <Select id="first-type" labelId="first-type" label="Type"
            value={currentAttributeType}
            onChange={ e => setCurrentAttributeType(e.target.value)}
            >
                <MenuItem value="S">String</MenuItem>
                <MenuItem value="N">Number</MenuItem>
                <MenuItem value="B">Boolean</MenuItem>
                <MenuItem value="L">List</MenuItem>
                <MenuItem value="M">Map</MenuItem>
            </Select>
        </FormControl>
                </Grid>
                <Grid item xs={4} align="start">
                    <Button variant="contained" onClick={handleAttribute}>Add</Button>
                </Grid>
			</Grid>
		</Container>
	);
}
