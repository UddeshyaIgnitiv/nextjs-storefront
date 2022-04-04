import { InputLabel, MenuItem, OutlinedInput } from '@mui/material'
import { FormControl, FormHelperText, Select } from '@mui/material'
export interface KiboSelectProps {
  name?: string
  value?: string
  helperText?: string
  error?: boolean
  placeholder?: string
  label?: string
  children: React.ReactNode
  onChange: (name: string, value: string) => void
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const KiboSelect = (props: KiboSelectProps) => {
  const {
    name = 'kibo-select',
    value = '',
    helperText = '',
    error = false,
    placeholder,
    label,
    children,
    onChange,
    ...rest
  } = props

  return (
    <FormControl sx={{ minWidth: 120, marginTop: 3 }} size="small" fullWidth variant="outlined">
      <InputLabel shrink htmlFor="kibo-input" sx={{ top: -18, left: -13 }}>
        {label}
      </InputLabel>
      <Select
        size="small"
        displayEmpty
        name={name}
        error={error}
        defaultValue={value}
        MenuProps={MenuProps}
        sx={{ height: '34px' }}
        inputProps={{ 'aria-hidden': false }}
        input={<OutlinedInput size="small" />}
        onChange={(event) => onChange(event.target.name, event.target.value as string)}
        {...rest}
      >
        <MenuItem value={''} disabled sx={{ display: 'none' }}>
          {placeholder}
        </MenuItem>
        {children}
      </Select>
      <FormHelperText
        error={error}
        {...(error && { 'aria-errormessage': helperText })}
        sx={{ margin: '3px 0' }}
      >
        {error ? helperText : ''}
      </FormHelperText>
    </FormControl>
  )
}

export default KiboSelect