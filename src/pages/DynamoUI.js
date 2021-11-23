import {
  Grid,
  Container,
  TextField,
  Typography,
  Button,
  ListItem,
  List,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles({
  gridMargin: {
    marginTop: "50px",
    marginBottom: "50px",
  },
  typoOutlined: {
    border: "1px solid #fd7e14",
    marginBottom: "5px",
    borderRadius: "5px",
    "&:hover": {
      borderColor: "#ffc107",
    },
  },
});

export default function DynamoUI() {
  const classes = useStyles();
  const [tableName, setTableName] = useState("");
  const [partitionKeyName, setPartitionKeyName] = useState("");
  const [partitionKeyType, setPartitionKeyType] = useState("HASH");
  const [sortKeyName, setSortKeyName] = useState("");
  const [sortKeyType, setSortKeyType] = useState("RANGE");
  const [readCapacitUnits, setReadCapacityUnits] = useState(10);
  const [writeCapacityUnits, setWriteCapacityUnits] = useState(10);
  const [currentAttributeName, setCurrentAttributeName] = useState("");
  const [attributeDefinitions, setAttributeDefinitions] = useState([]);
  const [currentAttributeType, setCurrentAttributeType] = useState("S");
  const [currentGlobalIndexName, setCurrentGlobalIndexName] = useState("");
  const [
    currentGlobalPartitionKeyName,
    setcurrentGlobalPartitionKeyName,
  ] = useState("");
  const [
    currentGlobalPartitionKeyType,
    setcurrentGlobalPartitionKeyType,
  ] = useState("HASH");
  const [currentGlobalSortKeyName, setCurrentGlobalSortKeyName] = useState("");
  const [currentGlobalSortKeyType, setCurrentGlobalSortKeyType] = useState(
    "RANGE"
  );
  const [globalSecondaryIndexes, setGlobalSecondaryIndexes] = useState([]);
  const [
    currentGlobalIndexProjection,
    setCurrentGlobalIndexProjection,
  ] = useState("ALL");
  const [
    currentGlobalReadCapacityUnits,
    setCurrentGlobalReadCapacityUnits,
  ] = useState(10);
  const [
    currentGlobalWriteCapacityUnits,
    setCurrentGlobalWriteCapacityUnits,
  ] = useState(10);

  const addAttributeDefinition = () => {
    if (currentAttributeName) {
      setAttributeDefinitions([
        ...attributeDefinitions,
        {
          id: uuidv4(),
          AttributeName: currentAttributeName,
          AttributeType: currentAttributeType,
        },
      ]);
      setCurrentAttributeName("");
    }
  };

  const deleteAttributeDefinition = (id) => {
    setAttributeDefinitions(
      attributeDefinitions.filter((current) => {
        return current.id !== id;
      })
    );
    setGlobalSecondaryIndexes(
      globalSecondaryIndexes.filter((current) => current.id !== id)
    );
  };

  const addGlobalIndex = () => {
    let id = uuidv4();
    if (currentGlobalIndexName && currentGlobalPartitionKeyName) {
      let globalObject = {
        id: id,
        IndexName: currentGlobalIndexName,
        KeySchema: [
          {
            AttributeName: currentGlobalPartitionKeyName,
            KeyType: currentGlobalPartitionKeyType,
          },
        ],
        Projection: { ProjectionType: currentGlobalIndexProjection },
        ProvisionedThroughput: {
          ReadCapacityUnits: Number(currentGlobalReadCapacityUnits),
          WriteCapacityUnits: Number(currentGlobalWriteCapacityUnits),
        },
      };
      if (currentGlobalSortKeyName) {
        globalObject.KeySchema.push({
          AttributeName: currentGlobalSortKeyName,
          KeyType: currentGlobalSortKeyType,
        });
      }

      setGlobalSecondaryIndexes([...globalSecondaryIndexes, globalObject]);
      if (currentGlobalSortKeyName) {
        setAttributeDefinitions([
          ...attributeDefinitions,
          {
            id: id,
            AttributeName: currentGlobalPartitionKeyName,
            AttributeType: "S",
          },
          {
            id: id,
            AttributeName: currentGlobalSortKeyName,
            AttributeType: "S",
          },
        ]);
      } else {
        setAttributeDefinitions([
          ...attributeDefinitions,
          {
            id: id,
            AttributeName: currentGlobalPartitionKeyName,
            AttributeType: "S",
          },
        ]);
      }
      setCurrentGlobalIndexName("");
      setcurrentGlobalPartitionKeyName("");
      setCurrentGlobalSortKeyName("");
    }
  };

  const deleteGlobalIndex = (id) => {
    setGlobalSecondaryIndexes(
      globalSecondaryIndexes.filter((current) => {
        return current.id !== id;
      })
    );
    setAttributeDefinitions(
      attributeDefinitions.filter((current) => current.id !== id)
    );
  };

  const submit = (e) => {
    if (tableName && partitionKeyName) {
      let data = {
        TableName: tableName,
        KeySchema: [
          {
            AttributeName: partitionKeyName,
            AttributeType: partitionKeyType,
          },
        ],
        AttributeDefinitions: [
          { AttributeName: partitionKeyName, AttributeType: "S" },
          ...attributeDefinitions,
        ],
        ProvisionedThroughput: {
          ReadCapacityUnits: readCapacitUnits,
          WriteCapacityUnits: writeCapacityUnits,
        },
      };

      if (sortKeyName) {
        data.KeySchema.push({
          AttributeName: sortKeyName,
          AttributeType: sortKeyType,
        });
        data.AttributeDefinitions.splice(1, 0, {
          AttributeName: sortKeyName,
          AttributeType: "S",
        });
      }

      if (globalSecondaryIndexes.length) {
        data.GlobalSecondaryIndexes = globalSecondaryIndexes;
        for (let x of data.GlobalSecondaryIndexes) {
          delete x.id;
        }
      }

      for (let x of data.AttributeDefinitions) {
        delete x.id;
      }

      console.log(data);
      let link = document.createElement("a");
      link.download = `dynamo-create-${tableName}-table.json`;
      link.href = `data:text/json;charset=uft-8, ${encodeURIComponent(
        JSON.stringify(data, null, 2)
      )}`;
      link.click();
    }
  };

  return (
    <Container>
      <Grid container justifyContent="around" alignItems="center" spacing={2}>
        <Grid item xs={12} align="center">
          <Typography variant="h6">DynamoDB Create Table</Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <TextField
            label="Table Name"
            required
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} align="end">
          <TextField
            label="Partition key"
            required
            value={partitionKeyName}
            onChange={(e) => setPartitionKeyName(e.target.value)}
          />
        </Grid>

        <Grid item xs={6} align="start">
          <TextField
            label="Sort key"
            value={sortKeyName}
            onChange={(e) => setSortKeyName(e.target.value)}
          />
        </Grid>

        <Grid item xs={6} align="end">
          <TextField
            type="number"
            label="ReadCapacityUnits"
            value={readCapacitUnits}
            required
            onChange={(e) => setReadCapacityUnits(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            label="WriteCapacityUnits"
            value={writeCapacityUnits}
            required
            onChange={(e) => setWriteCapacityUnits(e.target.value)}
          />
        </Grid>
        <Grid item xs={4} align="end">
          <TextField
            label="Attribute Name"
            value={currentAttributeName}
            onChange={(e) => setCurrentAttributeName(e.target.value)}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl>
            <InputLabel id="simple-select-label">Type</InputLabel>
            <Select
              labelId="simple-select-label"
              label="Type"
              value={currentAttributeType}
              onChange={(e) => setCurrentAttributeType(e.target.value)}
            >
              <MenuItem value="S">String</MenuItem>
              <MenuItem value="N">Number</MenuItem>
              <MenuItem value="B">Binary</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <Button variant="contained" onClick={addAttributeDefinition}>
            Add
          </Button>
        </Grid>
        <List sx={{ width: "100%", margin: 2 }}>
          {attributeDefinitions.map((schema) => {
            return (
              <ListItem
                className={classes.typoOutlined}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => {
                      deleteAttributeDefinition(schema.id);
                    }}
                  >
                    <DeleteOutlineIcon color="primary" />
                  </IconButton>
                }
              >
                <ListItemText>
                  {schema.AttributeName} ({schema.AttributeType})
                </ListItemText>
              </ListItem>
            );
          })}
        </List>
      </Grid>
      <br />
      <Divider />
      <br />
      <Grid container spacing={2} className={classes.grid}>
        <Grid item xs={12} align="center">
          <Typography variant="h6">Global Secondary Indexes</Typography>
        </Grid>
        <Grid item xs={12} align="center">
          <TextField
            label="Index Name"
            value={currentGlobalIndexName}
            onChange={(e) => setCurrentGlobalIndexName(e.target.value)}
          />
        </Grid>
        <Grid item xs={6} align="end">
          <TextField
            label="Partition key"
            required
            value={currentGlobalPartitionKeyName}
            onChange={(e) => setcurrentGlobalPartitionKeyName(e.target.value)}
          />
        </Grid>

        <Grid item xs={6} align="start">
          <TextField
            label="Sort key"
            value={currentGlobalSortKeyName}
            onChange={(e) => setCurrentGlobalSortKeyName(e.target.value)}
          />
        </Grid>

        <Grid item xs={6} align="end">
          <TextField
            type="number"
            label="ReadCapacityUnits"
            value={currentGlobalReadCapacityUnits}
            required
            onChange={(e) => setCurrentGlobalReadCapacityUnits(e.target.value)}
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            type="number"
            label="WriteCapacityUnits"
            value={currentGlobalWriteCapacityUnits}
            required
            onChange={(e) => setCurrentGlobalWriteCapacityUnits(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} align="center">
          <FormControl>
            <InputLabel id="projection-simple-select-label">
              Projection
            </InputLabel>
            <Select
              labelId="projection-simple-select-label"
              label="Projection"
              value={currentGlobalIndexProjection}
              onChange={(e) => setCurrentGlobalIndexProjection(e.target.value)}
            >
              <MenuItem value="ALL">All</MenuItem>
              <MenuItem value="INCLUDE">Include</MenuItem>
              <MenuItem value="KEYS_ONLY">Keys only</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} align="center">
          <Button variant="contained" onClick={addGlobalIndex}>
            Add Index
          </Button>
        </Grid>
        <List sx={{ width: "100%", margin: 2 }}>
          {globalSecondaryIndexes.map((schema) => {
            return (
              <ListItem
                className={classes.typoOutlined}
                secondaryAction={
                  <IconButton
                    edge="end"
                    onClick={() => {
                      deleteGlobalIndex(schema.id);
                    }}
                  >
                    <DeleteOutlineIcon color="primary" />
                  </IconButton>
                }
              >
                <ListItemText>
                  IndexName: {schema.IndexName}
                  <br />
                  Attribute Name:{" "}
                  {schema.KeySchema.map((item) => item.AttributeName)}
                </ListItemText>
              </ListItem>
            );
          })}
        </List>

        <Grid item xs={12} align="end">
          <br />
          <Button
            variant="contained"
            onClick={submit}
            style={{ margin: "50px" }}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}
