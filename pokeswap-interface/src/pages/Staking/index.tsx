import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import titleIcon from '../../assets/img/PokeSwap_Light-Character3.svg'
import titleIcon_dark from '../../assets/img/PokeSwap_Dark - Character3.svg'
import leftIcon from '../../assets/img/PokeSwap_Cap - Staked Icon.svg'
import logo from '../../assets/benefit/PokeSwap-Rewards_Design-Files_Logo-LightVersion.svg'
import darkLogo from '../../assets/benefit/PokeSwap-Rewards_Design-Files_Logo-DarkVersion.svg'

import info_icon_dark from '../../assets/svg/Info-icon_Dark.svg'
import info_icon_white from '../../assets/svg/Info-icon_White.svg'

import { useDarkModeManager } from '../../state/user/hooks'
import Modal from '../../components/Modal'
import { getBallsBarContract,getBallsTokenContract } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import { BallsBar } from '../../constants'
import { MaxUint256 } from '@ethersproject/constants'
import { isMobile } from 'react-device-detect'
import { useTranslation } from 'react-i18next'
// import useBlock from '../../hooks/useBlock'

import Web3 from 'web3';
var web3 = new Web3('https://mainnet.infura.io/v3/099fc58e0de9451d80b18d7c74caa7c1')
const LeftBox = styled.div`
    background-image :url(${({theme})=>theme.bg8});
    float:left;
    background-repeat: no-repeat;
    width: 330px;
    height: 280px;
    text-align: left;
    padding-left: 90px;
    background-size: 43% 100%;
    @media (max-width:480px){
      clear:both;
      padding:0;
      width:100%;
    }
    
`
const LeftBoxDark = styled.div`
    background-image :url(${({theme})=>theme.bg8});
    float:left;
    background-repeat: no-repeat;
    width: 430px;
    height: 280px;
    text-align: left;
    padding-left: 133px;
    background-size: 50%;
    background-position-y: 20px;
    @media (max-width:480px){
      clear:both;
      width:100%;
      padding-left:0px;
    }
    
`

const RightBox = styled.div`
    background-image :url(${({theme})=>theme.bg9});
    float:left;
    width: 350px;
    background-size: 44% 76%;
    background-repeat: no-repeat;
    background-position-x: 200px;
    background-position-y: 50px;
    padding-left: 30px;
    @media (max-width:480px){
      clear:both;
      width:100%;
      padding-left: 0px;
    }
    
`
const RightBoxDark = styled.div`
    background-image :url(${({theme})=>theme.bg9});
    float:left;
    width: 370px;
    background-size: 42%;
    background-repeat: no-repeat;
    background-position-x: 177px;
    background-position-y: 66px;
    height:280px;
    @media (max-width:480px){
      clear:both;
      width:100%;
      padding-left:0px;
    }
    
`

const BoxCard = styled.div`
margin-right: 50px;
width: 240px;
border-radius: 10px;
border: 1px solid #f5f2f2;
background: white;
text-align:center;
box-shadow: 10px 20px 200px rgb(230 37 82 / 20%);
@media (max-width:480px){
  width:100%;
}
`
const BoxCardDark = styled.div`
margin-right: 50px;
width: 240px;
border-radius: 10px;
background: black;
text-align:center;
box-shadow: 10px 20px 200px rgb(230 37 82 / 20%);
@media (max-width:480px){
  width:100%;
}
`

const ButtonStyle = styled.button`
    height: 45px;
    border: 0;
    font-weight: bold;
    border-radius: 15px;
    font-size: 14px;
    width: 160px;
    margin-bottom: 15px;
    outline:0;
    cursor:pointer;
`

const TitleS = styled.div`
text-align: center;
    font-size: 24px;
    font-weight: bold;
    margin-top: 30px;
    margin-bottom: 40px;
`

const AvailibalS = styled.div`
width: 100%;
text-align: right;
padding-right: 5%;
color:#928e8e
`
const ContentS = styled.div`
width: 90%;
    border: 1px solid #d0cccc;
    height: 40px;
    margin-left: 5%;
    margin-top: 5px;
    margin-bottom: 10px;
`
const ButtonS1 = styled.button`
border: 0;
background: #dcd8d8;
color: #151313;
height: 36px;
font-size: 18px;
width: 100px;
border-radius: 7px;
outline:0;
    cursor:pointer;
`
const ButtonS2 = styled.button`
border: 0;
background: #f9dada;
color: #e23d5a;
height: 36px;
font-size: 18px;
width: 100px;
border-radius: 7px;
margin-left: 20px;
outline:0;
    cursor:pointer;
`
const Content1Span = styled.span`
font-size: 12px;
    display: inline-block;
    padding-right: 10px;
    padding-left: 40px;
`
const Content2Span = styled.span`
background: #f7db89;
    display: inline-block;
    color: #e8476b;
    font-weight: bold;
    cursor:pointer;
`
const Input = styled.input`
width:60%;
height:38px;
border:0;
outline:none;
background:${({theme})=>theme.bg2};
color:${({theme})=>theme.text1};
`

// BALLS-ETH 1y Fees/Liquidity: xxx% APY    
// <---- 这个数直接抄info页面Top pairs里面的ETH-BALLS的最后一栏

// BALLS Staking : xxx% APR 
// <----这个要用公式算
// (xBALLS price - 1) * (365/days since start) ，以百分比形式显示

// 例：
// 现在1 xBALSS=1.0707 BALLS，那么BALLS Stakings=(1.0707 - 1) * (365/1)=2555%

export default function Staking() {
  const {t} = useTranslation()
  // const block = useBlock()
  const { account, chainId, library } = useActiveWeb3React()
  const [showHarvest, setShowHarvest] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isDark] = useDarkModeManager()
  const [xballsBal,setXBallsBalance] = useState('0.0000')
  const [tokenBalance,setTokenBalance] = useState('0.0000')
  const [inputBallsToBalls, setInputBallsToBalls] = useState('0.0000');
  const [inputXBallToBalls, setInputXBallToBalls] = useState('0.0000');
  const [allowance,setAllowance] = useState(0)
  const [barBallsBal, setBarBallsBal] = useState('0.0000')
  const [xballsTotalSupply,setXballsTotalSupply] = useState('0.0000')
  // const [txHash,setTxHash] = useState('');
  const [willReceive,setWillRecieve] = useState('0.0000')

  useEffect(()=>{
      getXballBalance()
      getTokenBalance()
      getAlowance()
      getBArBal()
      getXBArTotalSupply()
      // checkTxHash()
      
  },[])

  async function getXballBalance(){
    if (!chainId || !library || !account) return
    const ballsbar = getBallsBarContract(chainId, library, account);
    let xballs = await ballsbar.balanceOf(account);
    if(xballs!=0){
      setXBallsBalance(String(xballs/10**18))
    }
  }
  async function getTokenBalance(){
    if (!chainId || !library || !account) return
    const ballsToken = getBallsTokenContract(chainId, library, account);
    let tokenBalance = await ballsToken.balanceOf(account);
    setTokenBalance(String(tokenBalance/10**18))
  }
  async function getAlowance(){
    if (!chainId || !library || !account) return
    const ballsToken = getBallsTokenContract(chainId, library, account);
    let allowance = await ballsToken.allowance(account,BallsBar);
    setAllowance(allowance)
  }
  function approveBtn(){
    if (!chainId || !library || !account) return
    const ballsToken = getBallsTokenContract(chainId, library, account);
    ballsToken.approve(BallsBar,MaxUint256).then((res:any)=>{
    });
  }
  async function getBArBal(){
    if (!chainId || !library || !account) return
    const ballsToken = getBallsTokenContract(chainId, library, account);
    const bal = await ballsToken.balanceOf(BallsBar);
    console.log("bal---",bal)
    setBarBallsBal(Number(bal/10**18).toFixed(4))
  }
  async function getXBArTotalSupply(){
    if (!chainId || !library || !account) return
    const ballsBar = getBallsBarContract(chainId, library, account);
    const supply = await ballsBar.totalSupply();
    console.log("supply---",supply)
    setXballsTotalSupply(Number(supply/10**18).toFixed(4))
    
    
  } 

  function onFocusInput(){
    setInputBallsToBalls('')
    setInputXBallToBalls('')
  }
  // function checkTxHash(){
  //   if(txHash.length>0){
  //     const timeInter = setInterval(()=>{
  //       if(!library) return;
        
  //         library.getTransactionReceipt(txHash).then((res)=>{
  //           console.log("resass--",res)
  //           if(res && res.status===1){
  //             getXballBalance()
  //             getTokenBalance()
  //             getAlowance()
  //             setTxHash('')
  //             console.log("update----")
  //             clearInterval(timeInter)
  //           }
  //         })
  //     },1000)
  //   }
  // }
  const TipsSty = styled.div`
  display: block;
  padding: 10px 16px;
  border-radius: 7px;
  color:#f25166;
  font-weight:bold;
  `
  const Tips2St = styled.div`
  margin-top: 30px;
  color: ${({theme})=>theme.text1};
  font-size:12px;
  text-align: left;
  @media (max-width:480px){
    width:100%;
  }
  `

  const ImgTitle = styled.img`
 
    @media (max-width:480px){
      width: 60%;
      margin-top: 80px;
    }
  `
  const TipsOutDiv = styled.div`
  padding: 10px 15px;
  margin-top: 10px;
  `
  async function enterBtn(){
    if (!chainId || !library || !account) return
    const ballsbar = getBallsBarContract(chainId, library, account);
    let amount = await web3.utils.toWei(inputBallsToBalls);
    ballsbar.enter(amount).then((res:any)=>{
      // setTxHash(res.hash)
      setShowConfirmation(false)
      if(Number(barBallsBal)==0){
        setXBallsBalance(Number(Number(xballsBal)+Number(inputBallsToBalls)).toFixed(4))
      }else{
        setXBallsBalance(Number(Number(xballsBal)+Number(inputBallsToBalls)*Number(barBallsBal)/Number(xballsTotalSupply)).toFixed(4))
      }
      setTokenBalance(Number(Number(tokenBalance)-Number(inputBallsToBalls)).toFixed(4))
    })
  }
  async function leaveBtn(){
    if (!chainId || !library || !account) return
    const ballsbar = getBallsBarContract(chainId, library, account);
    let amount = await web3.utils.toWei(inputXBallToBalls);
    ballsbar.leave(amount).then((res:any)=>{
      // setTxHash(res.hash)
      setShowHarvest(false)
      setXBallsBalance(String(Number(xballsBal)-Number(inputXBallToBalls)))
      const nums = Math.round((Number(tokenBalance)+(Number(inputXBallToBalls)*Number(barBallsBal)/Number(xballsTotalSupply))*100));
      setTokenBalance(Number(nums/100).toFixed(4));
    })
  }
  function setReceiveAmount(inputValue:any,index:any){
    if(index==1){
      let receive = Number(inputValue)*(Number(barBallsBal)/Number(xballsTotalSupply));
      console.log("inputValue--",receive)
      setWillRecieve(Number(receive).toFixed(8));
    }else{
      let receive = Number(inputValue)/(Number(barBallsBal)/Number(xballsTotalSupply));
      console.log("inputValue--",receive)
      setWillRecieve(Number(receive).toFixed(8));
    }
    
  }

  function setBallsToXBallsMax(){
    setInputBallsToBalls(tokenBalance.substr(0,tokenBalance.length-1))
    setReceiveAmount(tokenBalance.substr(0,tokenBalance.length-1),2)
  }
  function setXBallsToBallsMax(){
    setInputXBallToBalls(xballsBal.substr(0,xballsBal.length-1))
    setReceiveAmount(xballsBal.substr(0,xballsBal.length-1),1)
  }

  function onChangeInputBallsToXBalls(e:any){
    
    let inputValue =  tokenBalance;
    if(e.target.value <= Number(tokenBalance)){
      inputValue = e.target.value;
    }
    setInputBallsToBalls(inputValue);
    setReceiveAmount(inputValue,2)
  }

  function onChangeInputXBallToBalls(e:any){
    let inputValue =  xballsBal;
    if(e.target.value <= xballsBal){
      inputValue = e.target.value;
    }
    setInputXBallToBalls(inputValue);
    setReceiveAmount(inputValue,1)
  }
  function showMadalLeft(){
    setShowHarvest(true)
    setWillRecieve('0.0000')
  }
  function showMadalRight(){
    setShowConfirmation(true)
    setWillRecieve('0.0000')
  }
  return (
    <>
      <ImgTitle style={{width:isMobile?"66%":(isDark?'26%':'20%')}} src={isDark?titleIcon_dark:titleIcon}/>
      <TitleS>
      {t('staking_title')}
      </TitleS>
      <div style={{width:isMobile?"100%":(isDark?'805px':'700px')}}>
          {isDark?(<><LeftBoxDark >
            <BoxCardDark>
                    <img style={{width:'37%',padding:'15px',marginTop:'15px'}} src={leftIcon}/>
                    <div style={{fontSize:'23px',fontWeight:'bold'}}>{Number(xballsBal).toFixed(4)}</div>
          <div style={{fontSize:'14px',marginTop:'7px',marginBottom:'25px',color:'#aba7a7'}}>{t('staking_left1')}</div>
                    <ButtonStyle style={{background:'#fde1ea',color:'#ea4f4f'}}  onClick={showMadalLeft}>{t('staking_left2')}</ButtonStyle>
                    
            </BoxCardDark>
          </LeftBoxDark></>):(<><LeftBox >
            <BoxCard>
                    <img style={{width:'37%',padding:'15px',marginTop:'15px'}} src={leftIcon}/>
                    <div style={{fontSize:'23px',fontWeight:'bold'}}>{Number(xballsBal).toFixed(4)}</div>
                    <div style={{fontSize:'14px',marginTop:'7px',marginBottom:'25px',color:'#aba7a7'}}>{t('staking_left1')}</div>
                    {Number(xballsBal)<=0?(<>
                    <ButtonStyle disabled={true}  style={{background:'rgb(195 180 180)',color:'white'}} >{t('staking_left2')}</ButtonStyle></>):(<>
                    <ButtonStyle style={{background:'#fde1ea',color:'#ea4f4f'}} onClick={showMadalLeft}>{t('staking_left2')}</ButtonStyle></>)}
                    
            </BoxCard>
          </LeftBox></>)}
          {/* <TipsSty style={{clear:'both',textAlign:'center',marginBottom:'20px',display:isMobile?"block":"none",background:isDark?"#562929":"white"}}>1 xBALLS {' ≈ '} {Number(Number(barBallsBal)/Number(xballsTotalSupply)).toFixed(8)} BALLS</TipsSty> */}
          {/* <TipsOutDiv>
      <TipsSty style={{display:isMobile?"none":"block",background:isDark?"#562929":"white"}}>1 xBALLS {' ≈ '} {Number(Number(barBallsBal)/Number(xballsTotalSupply)).toFixed(8)} BALLS</TipsSty>
      </TipsOutDiv>
      <TipsOutDiv>
      <TipsSty style={{display:isMobile?"none":"block",background:isDark?"#562929":"white"}}>BALLS Stakings =  {(Number(Number(barBallsBal)/Number(xballsTotalSupply)-1)*(365)*100).toFixed(0)} %</TipsSty>
      </TipsOutDiv> */}
          {isDark?(<><RightBoxDark>
                <BoxCardDark>
                    <img style={{width:'28%',padding:'6px',marginTop:'15px',marginBottom:'7px'}} src={isDark?darkLogo:logo}/>
                    <div style={{fontSize:'23px',fontWeight:'bold'}}>{Number(tokenBalance).toFixed(4)}</div>
          <div style={{fontSize:'14px',marginTop:'7px',marginBottom:'25px',color:'#aba7a7'}}>{t('staking_right')}</div>
                    {allowance==0?(<><ButtonStyle style={{background:'#f56262',color:'white'}} onClick={approveBtn}>
                      Approve To xBALLS
                    </ButtonStyle></>):(<>{Number(tokenBalance)<=0?(<ButtonStyle disabled={true} style={{background:'rgb(195 180 180)',color:'white'}}>
                    {t('staking_right1')}
                    </ButtonStyle>):(<ButtonStyle style={{background:'#f56262',color:'white'}} onClick={showMadalRight}>
                    {t('staking_right1')}
                    </ButtonStyle>)}</>)}
                </BoxCardDark>
          </RightBoxDark></>):(<><RightBox>
            <BoxCard>
                    <img style={{width:'28%',padding:'6px',marginTop:'15px',marginBottom:'7px'}} src={isDark?darkLogo:logo}/>
                    <div style={{fontSize:'23px',fontWeight:'bold'}}>{Number(tokenBalance).toFixed(4)}</div>
                    <div style={{fontSize:'14px',marginTop:'7px',marginBottom:'25px',color:'#aba7a7'}}>{t('staking_right')}</div>
                    {allowance==0?(<><ButtonStyle style={{background:'#f56262',color:'white'}} onClick={approveBtn}>
                      Approve To xBALLS
                    </ButtonStyle></>):(<>{Number(tokenBalance)<=0?(<ButtonStyle disabled={true} style={{background:'rgb(195 180 180)',color:'white'}}>
                      {t('staking_right1')}
                    </ButtonStyle>):(<ButtonStyle style={{background:'#f56262',color:'white'}} onClick={showMadalRight}>
                      {t('staking_right1')}
                    </ButtonStyle>)}</>)}
                    
                </BoxCard>
          </RightBox></>)}
          <Modal isOpen={showHarvest}  onDismiss={() => setShowHarvest(false)} maxHeight={100}>
            <div style={{width:'100%', textAlign:'center'}}>
              <h4>{t('staking_mo2')}</h4>
              <AvailibalS>{xballsBal} <span style={{fontWeight:'bold'}}>xBALLS</span> {t('staking_availibale')}</AvailibalS>
              <ContentS>
                <Input onFocus={onFocusInput} onChange={(e)=>onChangeInputXBallToBalls(e)} value={inputXBallToBalls}  type="text"/>
                <Content1Span>xBALLS</Content1Span>
                <Content2Span onClick={setXBallsToBallsMax}>Max</Content2Span>
              </ContentS>
              <p>{t('staking_yue')}<span style={{color:'#e88888'}}>{willReceive}</span> BALLS</p>
              <div style={{marginBottom:'20px'}}>
                <ButtonS1  onClick={() => setShowHarvest(false)}>Cancel</ButtonS1>
                <ButtonS2 onClick={leaveBtn}>Confirm</ButtonS2>
              </div>
            </div>
          </Modal>
          <Modal isOpen={showConfirmation}  onDismiss={() => setShowConfirmation(false)} maxHeight={100}>
            <div style={{width:'100%', textAlign:'center'}}>
              <h4>{t('staking_mo1')}</h4>
              <AvailibalS>{tokenBalance} <span style={{fontWeight:'bold'}}>BALLS</span> {t('staking_availibale')}</AvailibalS>
              <ContentS>
                <Input onFocus={onFocusInput} onChange={(e)=>onChangeInputBallsToXBalls(e)} value={inputBallsToBalls}  type="text"/>
                <Content1Span>BALLS</Content1Span>
                <Content2Span onClick={setBallsToXBallsMax}>Max</Content2Span>
              </ContentS>
              <p>{t('staking_yue')} <span style={{color:'red'}}>{willReceive}</span> xBALLS</p>
              <div style={{marginBottom:'20px'}}>
                <ButtonS1  onClick={() => setShowConfirmation(false)}>Cancel</ButtonS1>
                <ButtonS2 onClick={enterBtn}>Confirm</ButtonS2>
              </div>
            </div>
          </Modal>
            
      </div>
      <TipsOutDiv>
      <TipsSty style={{background:isDark?"#562929":"white"}}>1 xBALLS {' ≈ '} {Number(Number(barBallsBal)/Number(xballsTotalSupply)).toFixed(8)} BALLS</TipsSty>
      </TipsOutDiv>
      <TipsOutDiv>
      <TipsSty style={{background:isDark?"#562929":"white"}}>Staking APR =  {(Number(Number(barBallsBal)/Number(xballsTotalSupply)-1)*(365)*100).toFixed(0)} %</TipsSty>
      </TipsOutDiv>
      <Tips2St>
        <img style={{float:'left',display:'inline-block',width:'15px',marginRight:'5px'}} src={isDark?info_icon_white:info_icon_dark}/>
        <div style={{float:'left'}}>
          <div>{t('staking_tip1')} </div>
          <div>{t('staking_tip2')} </div> 
          <div>{t('staking_tip3')}</div>
        </div>
      </Tips2St>
      
    </>
  )
}
