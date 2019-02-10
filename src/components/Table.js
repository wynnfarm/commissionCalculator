import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import moment from 'moment';

const styles = theme => ({
  root: {
    // width: '60%',
    marginLeft: '40%',
    maxWidth: 255,
    marginTop: theme.spacing.unit * 3,
    // overflowX: 'auto',
  },
  table: {
    minWidth: 200
  },
});

let id = 0;
function createData(dateIn, commissionIn) {
  id += 1;
  let date = moment(dateIn, "MM/DD/YYYY").add(1, 'month').format("MM/DD/YYYY");
  let commission = Math.round((commissionIn * .90) * 100) / 100;
  return { id, date, commission };
}

// let rows = [
//   createData('1/1/2019', 159),
//   createData('1/15/2019', 237),
//   createData('2/1/2019', 262),
//   createData('2/15/2019', 305),
//   createData('3/1/2019', 356),
// ];

function SimpleTable(props) {
  const { classes } = props;
  let arrayOfCommission = Object.entries(props.data);
  let rows = arrayOfCommission.map((data, index) => {
      let x = createData(data[0], data[1]);
      return x;
  })
  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell align="right">Commission</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.id}>
              <TableCell component="th" scope="row">
                {row.date}
              </TableCell>
              <TableCell align="right">{row.commission}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);