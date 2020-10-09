import { ChainId } from 'pokesdk'
import React from 'react'
import { isMobile } from 'react-device-detect'
import { Text } from 'rebass'
import { NavLink  } from 'react-router-dom'
import styled from 'styled-components'

// import Logo from '../../assets/svg/logo.svg'
// import LogoDark from '../../assets/svg/logo_white.svg'
// import Wordmark from '../../assets/svg/wordmark.svg'
// import WordmarkDark from '../../assets/svg/wordmark_white.svg'
import { useActiveWeb3React } from '../../hooks'
import { useDarkModeManager } from '../../state/user/hooks'
import { useETHBalances } from '../../state/wallet/hooks'

import { YellowCard } from '../Card'
import Settings from '../Settings'
import Menu from '../Menu'

import { RowBetween } from '../Row'
import Web3Status from '../Web3Status'
import light_light from '../../assets/img/PokeSwap_Lightver-Sun.svg'
import xiexian_light from '../../assets/img/PokeSwap_Lightver-Divider.svg'
import dark_light from '../../assets/img/PokeSwap_Lightver-Moon.svg'
import light_dark from '../../assets/img/PokeSwap_Darkver-Sun.svg'
import xiexian_dark from '../../assets/img/PokeSwap_Darkver-Divider.svg'
import dark_dark from '../../assets/img/PokeSwap_Darkver-Moon.svg'
import logo_light from '../../assets/img/PokeSwap_Logo_WhiteVer.svg'
import logo_dark from '../../assets/img/PokeSwap_Logo_DarkVer.svg'
// import VersionSwitch from './VersionSwitch'

const activeClassName = 'ACTIVE'

const StyledNavLink = styled(NavLink).attrs({
  activeClassName
})`
  ${({ theme }) => theme.flexRowNoWrap}
  width:25%;
  text-align:center;
  display:inline-table;
  align-items: center;
  justify-content: center;
  height: 3rem;
  border-radius: 3rem;
  outline: none;
  cursor: pointer;
  text-decoration: none;
  color: ${({theme})=>theme.text1};
  font-size: 16px;
  font-weight:600;

  &.${activeClassName} {
    border-radius: 12px;
    color: ${({ theme }) => theme.text1};
  }

  :hover,
  :focus {
    color: red;
  }
  @media (max-width:480px){
    width:25%;
    font-size:14px
  }
`
const HeaderFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  width: 100%;
  top: 0;
  position: absolute;
  z-index: 2;
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    padding: 12px 0 0 0;
    width: calc(100%);
    position: relative;
  `};
`

const HeaderElement = styled.div`
  display: flex;
  align-items: center;
`

const HeaderElementWrap = styled.div`
  display: flex;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-top: 0.5rem;
`};
`

const Title = styled.a`
  display: flex;
  align-items: center;
  pointer-events: auto;

  :hover {
    cursor: pointer;
  }
`

// const TitleText = styled(Row)`
//   width: fit-content;
//   white-space: nowrap;
//   ${({ theme }) => theme.mediaWidth.upToExtraSmall`
//     display: none;
//   `};
// `

const AccountElement = styled.div<{ active: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: ${({ theme, active }) => (!active ? theme.bg1 : theme.bg3)};
  border-radius: 12px;
  white-space: nowrap;
  width: 40%;

  :focus {
    border: 1px solid blue;
  }
`

const TestnetWrapper = styled.div`
  white-space: nowrap;
  width: fit-content;
  margin-left: 10px;
  pointer-events: auto;
`

const NetworkCard = styled(YellowCard)`
  width: fit-content;
  margin-right: 10px;
  border-radius: 12px;
  padding: 8px 12px;
`

const UniIcon = styled.div`
  width:130px;
  padding-top:5px;
  transition: transform 0.3s ease;
  :hover {
    transform: rotate(-5deg);
  }
  ${({ theme }) => theme.mediaWidth.upToSmall`
    img { 
      width: 4.5rem;
    }
  `};
`

const HeaderControls = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    flex-direction: column;
    align-items: flex-end;
  `};
`

const BalanceText = styled(Text)`
  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    display: none;
  `};
`

const MenuText = styled.div`
  width:100%;
  line-height: 50px;
  flex-direction: row;
  height: 50px;
  align-items:center;
  @media (max-width:480px){
    width: 280px;
    z-index: 100;
    position: absolute;
    top: 66px;
    left:0;
  }
`

const NETWORK_LABELS: { [chainId in ChainId]: string | null } = {
  [ChainId.MAINNET]: null,
  [ChainId.RINKEBY]: 'Rinkeby',
  [ChainId.ROPSTEN]: 'Ropsten',
  [ChainId.GÖRLI]: 'Görli',
  [ChainId.KOVAN]: 'Kovan'
}


export default function Header() {
  const { account, chainId } = useActiveWeb3React()
  const userEthBalance = useETHBalances(account ? [account] : [])?.[account ?? '']
  const [isDark,toggleDarkMode] = useDarkModeManager()
 
  return (
    <HeaderFrame>
      <RowBetween style={{ alignItems: 'flex-start' }} padding="1rem 1rem 0 1rem">
        <div style={{width:'30%'}}>
          <HeaderElement>
            <Title href=".">
              <UniIcon>
                {/* <img src={isDark ? LogoDark : Logo} alt="logo" /> */}
                <img src={isDark?logo_dark:logo_light}/>
              </UniIcon>
              {/* // <TitleText>
              //   <img style={{ marginLeft: '4px', marginTop: '4px' }} src={isDark ? WordmarkDark : Wordmark} alt="logo" />
              // </TitleText> */}
            </Title>
          </HeaderElement>
        </div>
        <div style={{width:'40%',textAlign:isMobile?"left":'right'}}>
          <HeaderElement>
            <MenuText>
                <StyledNavLink to="/">Home</StyledNavLink> 
                <StyledNavLink to="/swap">Exchange</StyledNavLink> 
                <StyledNavLink to="/staking">Staking</StyledNavLink> 
                <StyledNavLink to="/rewards">Rewards</StyledNavLink> 
            </MenuText>
          </HeaderElement>
        </div>
        
        <HeaderControls>
          <HeaderElement>
            <div style={{textAlign:'right'}}>
              <img  onClick={toggleDarkMode} style={{width:isMobile?"17%":"7%"}} src={isDark?light_dark:light_light}/>
              <img style={{width:isMobile?"7%":"3%",margin:'0 6px 0 6px'}}  src={isDark?xiexian_dark:xiexian_light}/>
              <img onClick={toggleDarkMode} style={{width:isMobile?"17%":"7%"}}  src={isDark?dark_dark:dark_light}/>
            </div>
            <TestnetWrapper>
              {!isMobile && chainId && NETWORK_LABELS[chainId] && <NetworkCard>{NETWORK_LABELS[chainId]}</NetworkCard>}
            </TestnetWrapper>
            <AccountElement active={!!account} style={{ pointerEvents: 'auto' }}>
              {account && userEthBalance ? (
                <BalanceText style={{ flexShrink: 0 }} pl="0.75rem" pr="0.5rem" fontWeight={500}>
                  {userEthBalance?.toSignificant(4)} ETH
                </BalanceText>
              ) : null}
              <Web3Status/>
            </AccountElement>
          </HeaderElement>
          <HeaderElementWrap>
            {/* <VersionSwitch /> */}
            <Settings />
            <Menu />
          </HeaderElementWrap>
        </HeaderControls>
      </RowBetween>
    </HeaderFrame>
  )
}
