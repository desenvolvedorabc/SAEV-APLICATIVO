import { Autocomplete, TextField, ListItemText, ListItemIcon, Checkbox } from "@mui/material";
import { useState, useEffect } from "react";

interface AutoCompleteWithAllOptionProps {
  value: any;
  onChange: (newValue: any) => void;
  options: any[];
  getOptionLabel: (option: any) => string;
  label: string;
  width?: string;
  disabled?: boolean;
  loading?: boolean;
  noOptionsText?: string;
  showAllOption?: boolean;
  totalCount?: number;
  allOptionLabel?: string;
  getOptionKey?: (option: any) => string | number;
  renderOption?: (props: any, option: any) => React.ReactNode;
}

export function AutoCompleteWithAllOption({
  value,
  onChange,
  options = [],
  getOptionLabel,
  label,
  width = "100%",
  disabled = false,
  loading = false,
  noOptionsText = "Selecione",
  showAllOption = false,
  totalCount = 0,
  allOptionLabel = "Todas",
  getOptionKey = (option) => option.id || option.ID || option.SER_ID || option.ESC_ID || option.TURMA_TUR_ID,
  renderOption
}: AutoCompleteWithAllOptionProps) {
  const [isAllSelected, setIsAllSelected] = useState(false);

  useEffect(() => {
    try {
      if (value && typeof getOptionKey === 'function' && getOptionKey(value) === 'ALL') {
        setIsAllSelected(true);
      } else {
        setIsAllSelected(false);
      }
    } catch (error) {
      console.error('Erro no useEffect do AutoCompleteWithAllOption:', error);
      setIsAllSelected(false);
    }
  }, [value, getOptionKey]);

  const handleChange = (event: any, newValue: any) => {
    try {
      if (newValue && typeof getOptionKey === 'function' && getOptionKey(newValue) === 'ALL') {
        setIsAllSelected(true);

        const sampleOption = Array.isArray(options) ? options[0] : null;
        let allOption;

        if (sampleOption && typeof sampleOption === 'object') {
          const keyField = Object.keys(sampleOption).find(key =>
            key.includes('ID') || key === 'id'
          ) || 'id';
          const labelField = Object.keys(sampleOption).find(key =>
            key.includes('NOME') || key === 'name' || key === 'label'
          ) || 'name';

          allOption = {
            [keyField]: 'ALL',
            [labelField]: `${allOptionLabel} (${totalCount || 0})`
          };
        } else {
          allOption = {
            id: 'ALL',
            name: `${allOptionLabel} (${totalCount || 0})`
          };
        }

        if (typeof onChange === 'function') {
          onChange(allOption);
        }
      } else {
        setIsAllSelected(false);
        if (typeof onChange === 'function') {
          onChange(newValue);
        }
      }
    } catch (error) {
      console.error('Erro no handleChange do AutoCompleteWithAllOption:', error);
      setIsAllSelected(false);
      if (typeof onChange === 'function') {
        onChange(null);
      }
    }
  };

  const getOptions = () => {
    try {
      const safeOptions = Array.isArray(options) ? options : [];

      if (!showAllOption) {
        return safeOptions;
      }

      const sampleOption = safeOptions[0];
      let allOption;

      if (sampleOption && typeof sampleOption === 'object') {
        const keyField = Object.keys(sampleOption).find(key =>
          key.includes('ID') || key === 'id'
        ) || 'id';
        const labelField = Object.keys(sampleOption).find(key =>
          key.includes('NOME') || key === 'name' || key === 'label'
        ) || 'name';

        allOption = {
          [keyField]: 'ALL',
          [labelField]: `${allOptionLabel} (${totalCount || 0})`
        };
      } else {
        allOption = {
          id: 'ALL',
          name: `${allOptionLabel} (${totalCount || 0})`
        };
      }

      return [allOption, ...safeOptions];
    } catch (error) {
      console.error('Erro no getOptions do AutoCompleteWithAllOption:', error);
      return [];
    }
  };

  const defaultRenderOption = (props: any, option: any) => {
    try {
      const optionKey = typeof getOptionKey === 'function' ? getOptionKey(option) : 'unknown';
      const optionLabel = typeof getOptionLabel === 'function' ? getOptionLabel(option) : '';

      return (
        <li {...props} key={optionKey}>
          {showAllOption && optionKey === 'ALL' ? (
            <>
              <ListItemIcon>
                <Checkbox checked={isAllSelected} />
              </ListItemIcon>
              <ListItemText primary={optionLabel} />
            </>
          ) : (
            <ListItemText primary={optionLabel} />
          )}
        </li>
      );
    } catch (error) {
      console.error('Erro no defaultRenderOption do AutoCompleteWithAllOption:', error);
      return (
        <li {...props} key="error">
          <ListItemText primary="Erro ao renderizar opção" />
        </li>
      );
    }
  };

  return (
    <Autocomplete
      style={{width: width, background: "#FFF"}}
      className=""
      id={`autocomplete-${label.toLowerCase()}`}
      size="small"
      value={value}
      noOptionsText={noOptionsText}
      options={getOptions()}
      getOptionLabel={getOptionLabel}
      onChange={handleChange}
      disabled={disabled}
      loading={loading}
      sx={{
        "& .Mui-disabled": {
          background: "#D3D3D3",
        },
      }}
      renderInput={(params) => <TextField size="small" {...params} label={label} />}
      renderOption={renderOption || defaultRenderOption}
    />
  );
}