import React from 'react';
import { TableCell, TableRow, IconButton, Tooltip } from '@material-ui/core';
import ComputerIcon from '@material-ui/icons/Computer';
import DeleteIcon from '@material-ui/icons/Delete';
import { EmmaVm } from '@emma-community/backstage-plugin-emma-common';

interface ComputeRowProps {
  entry: EmmaVm;
  onEdit: () => void;
  onDelete: () => void;
}

export const ComputeRowComponent = ({ entry, onEdit, onDelete }: ComputeRowProps) => {
  return (
    <TableRow>
      <TableCell style={{ width: '20%' }}>{entry.label}</TableCell>
      <TableCell style={{ width: '20%' }}>{entry.provider?.name}</TableCell>
      <TableCell style={{ width: '20%' }}>{entry.status}</TableCell>
      <TableCell style={{ width: '20%' }}>{entry.type}</TableCell>
      <TableCell style={{ width: '20%' }}>
        <Tooltip title="Manage">
          <span>
            <IconButton onClick={onEdit} disabled={entry.status === 'BUSY'}>
              <ComputerIcon />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Delete">
          <span>
            <IconButton onClick={onDelete} disabled={entry.status === 'BUSY'}>
             <DeleteIcon />
            </IconButton>
          </span>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};
