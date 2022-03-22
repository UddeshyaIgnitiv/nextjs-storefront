import type { MouseEventHandler } from 'react'

import { Typography, Badge, Box } from '@mui/material'
import { styled } from '@mui/material/styles'

interface HeaderActionProps {
  title?: string
  subtitle?: string
  icon: any
  mobileIconColor?: string
  onClick: MouseEventHandler<HTMLDivElement>
  badgeContent?: string | number
}
const StyledBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    fontSize: '0.625rem',
    height: '16px',
    minWidth: '16px',
    padding: '0 2px',
  },
}))

const styles = {
  hoverOver: { '&:hover': { textDecoration: 'underline', cursor: 'pointer' } },
}

const HeaderAction = (props: HeaderActionProps) => {
  const { title, subtitle, onClick, badgeContent, mobileIconColor = 'white' } = props
  const Icon = props.icon
  return (
    <Box display="flex" alignItems="center" onClick={onClick}>
      <StyledBadge
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        color="primary"
        badgeContent={badgeContent}
      >
        <Icon
          sx={(theme: any) => ({
            [theme.breakpoints.down('md')]: {
              color: mobileIconColor,
            },
          })}
        ></Icon>
      </StyledBadge>
      <Box ml={1} sx={{ display: { sm: 'none', md: 'block' } }}>
        <Typography
          variant="body2"
          component="span"
          fontWeight="bold"
          color="text.primary"
          sx={{ display: 'block', ...styles.hoverOver }}
        >
          {title}
        </Typography>
        <Typography variant="body2" component="span" color="text.primary" sx={{ display: 'block' }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  )
}

export default HeaderAction
