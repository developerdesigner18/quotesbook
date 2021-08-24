/* eslint-disable no-use-before-define */
import { useState } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 345,
    [theme.breakpoints.down("sm")]: {
      maxWidth: 240,
    },
    "& > * + *": {
      marginTop: theme.spacing(3),
    },
  },
}));

export default function LimitTags() {
  const classes = useStyles();

  const [categories, setCategories] = useState([]);

  console.log(categories);

  const addCategory = (e) => {
    e.key === "Enter" && setCategories([...categories, e.target.value]);
  };

  return (
    <div className={classes.root}>
      <Autocomplete
        size="small"
        multiple
        limitTags={2}
        id="multiple-limit-tags"
        options={categories}
        // getOptionLabel={(option) => option.title}
        // defaultValue={[categories[0]]}
        renderInput={(params) => (
          <TextField
            onKeyUp={addCategory}
            {...params}
            variant="outlined"
            label="Categories"
          />
        )}
      />
    </div>
  );
}

// Categories
// const categories = [{ title: "inspirational" }, { title: "motivational" }];
