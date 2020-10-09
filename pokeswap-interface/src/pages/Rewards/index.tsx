import React,{useState,useEffect} from 'react'
import styled from 'styled-components'
import { getBallsRewardContract } from '../../utils'
import { useActiveWeb3React } from '../../hooks'
import logo from '../../assets/benefit/PokeSwap-Rewards_Design-Files_Logo-LightVersion.svg'
import logo_dark from '../../assets/benefit/PokeSwap-Rewards_Design-Files_Logo-DarkVersion.svg'
import { useDarkModeManager } from '../../state/user/hooks'
import useBlock from '../../hooks/useBlock'
// import { ChainId, Token, WETH, Fetcher, Route } from 'pokesdk'


// var Arrs = [[{
//         "name":"BALLS/ETH",
//         "reward":"33.33",
//         "pair":"0x6Bf4fF536DB3b16ACe63832af3eF75962FE63DAb",
//         "img":"PokeSwap-Rewards_Design-Files_Logo-LightVersion"
//     },
//     {
//         "name":"ETH/USDC",
//         "reward":"33.33",
//         "pair":"0x000000000000000000000000000000000",
//         "img":"PokeSwap_Bulbasaur"
//     },
//     {
//         "name":"YFI/ETH",
//         "reward":"33.33",
//         "pair":"0x000000000000000000000000000000000",
//         "img":"PokeSwap_Charizard"
//     },
//     {
//         "name":"SNX/ETH",
//         "reward":"33.33",
//         "pair":"0x000000000000000000000000000000000",
//         "img":"PokeSwap_Charmander"
//     }],[
//         {
//             "name":"LINK/ETH",
//             "reward":"33.33",
//             "pair":"0x000000000000000000000000000000000",
//             "img":"PokeSwap_MewTwo"
//         },
//         {
//             "name":"LEND/ETH",
//             "reward":"33.33",
//             "pair":"0x000000000000000000000000000000000",
//             "img":"PokeSwap_Pikachu"
//         },
//         {
//             "name":"COMP/ETH",
//             "reward":"33.33",
//             "pair":"0x000000000000000000000000000000000",
//             "img":"PokeSwap_Psyduck"
//         },
//         {
//             "name":"UMA/ETH",
//             "reward":"33.33",
//             "pair":"0x000000000000000000000000000000000",
//             "img":"PokeSwap_Rattata"
//         }
//     ],[
//         {
//             "name":"REN/ETH",
//             "reward":"33.33",
//             "pair":"0x000000000000000000000000000000000",
//             "img":"PokeSwap_Rhydon"
//         },
//         {
//             "name":"DAI/ETH",
//             "reward":"33.33",
//             "pair":"0xB5c8534D98116FC20146651503344343ad0161Ce",
//             "img":"PokeSwap_Rhydon"
//         }
//     ]
// ]
// var Arrs = [[{
//     "name":"BALLS/ETH",
//     "reward":"33.33",
//     "pair":"0x6Bf4fF536DB3b16ACe63832af3eF75962FE63DAb",
//     "img":"PokeSwap-Rewards_Design-Files_Logo-LightVersion"
// },
// {
//     "name":"DAI/ETH",
//     "reward":"33.33",
//     "pair":"0xB5c8534D98116FC20146651503344343ad0161Ce",
//     "img":"PokeSwap_Rhydon"
// }]
// ]
// var pairArr = ["0x6Bf4fF536DB3b16ACe63832af3eF75962FE63DAb","0xB5c8534D98116FC20146651503344343ad0161Ce"]

const CardStyle = styled.div`
    border: 1px solid ${({theme})=>theme.text6};;
    width: 260px;
    margin:20px;
    font-size: 20px;
    float: left;
    border-radius: 20px;
    background: ${({theme})=>theme.text6};
    @media (max-width:480px){
        clear:both;
        width:100%;
        margin:0;
        margin-top:20px;
      }
`
const BoxStyle = styled.div`
text-align: center;
@media (max-width:480px){
    padding-left:0;
    width:100%;
  }
`
const ButtonStyle = styled.button`
background: #f55b70;
    border: 0;
    width: 90%;
    color: #f8f8f9;
    outline: none;
    border: 1px solid #e87e7e;
    height: 40px;
    font-weight: bold;
    border-radius: 7px;
    font-size: 16px;
    cursor: pointer;
`
const TittlStyle = styled.div`
  font-size:24px;
  font-weight:bold;
  margin-top: 20px;
  margin-bottom: 20px;
`
const Detailstyle = styled.div`
color: #908c8c;
font-size: 13px;
`
const BottomBoxStyle = styled.div`
font-size: 12px;
    background: ${({theme})=>theme.bg10};;
    height: 30px;
    color: #e63030;
    border-radius: 7px;
    width: 90%;
    margin-left: 5%;
    line-height: 30px;
    margin-top:15px;
    margin-bottom:15px;
`

export default function Rewards() {
    const block = useBlock();
    const [isDark] = useDarkModeManager()
    const { account, chainId, library } = useActiveWeb3React()
    // const [dai,setDai] = useState('0')
    const [dai_a,setADai] = useState('0')
    const [dai_e,setDaiE] = useState('0')
    // const [balls,setBalls] = useState('0')
    const [balls_a,setABalls] = useState('0')
    const [balls_e,setBALLSE] = useState('0')
    const [balls_a1,setABalls1] = useState('0')
    const [balls_e1,setBALLSE1] = useState('0')
    const [balls_a2,setABalls2] = useState('0')
    const [balls_e2,setBALLSE2] = useState('0')

    useEffect(()=>{
        getReward()
    },[block,account])

    async function getReward(){
        
        if (!chainId || !library || !account) return
        const ballsRewardContract = getBallsRewardContract(chainId, library, account);
        let curId = await ballsRewardContract.getCurrentPeriodId();
        //dai
        // let dai = await ballsRewardContract.viewReward("0xB5c8534D98116FC20146651503344343ad0161Ce",account,false);
        // setDai(Number(dai*10/11/10**18).toFixed(2))
        let dai_active = await ballsRewardContract.viewReward("0xB5c8534D98116FC20146651503344343ad0161Ce",account,true);
        setADai(Number(dai_active[0]*10/11/10**18).toFixed(4))
        let dai_act = await ballsRewardContract.pairUserPeriodAmount("0xB5c8534D98116FC20146651503344343ad0161Ce",account,curId);
        setDaiE(Number(dai_act/10**18).toFixed(4))
        //balls
        // let balls = await ballsRewardContract.viewReward("0x271F219d68d85Dda0CcdAA6a4046De749212dffd",account,false);
        // setBalls(Number(balls*10/11/10**18).toFixed(2))
        let balls_acitve = await ballsRewardContract.viewReward("0x271F219d68d85Dda0CcdAA6a4046De749212dffd",account,true);
        setABalls(Number(balls_acitve[0]*10/11/10**18).toFixed(4))
        let balls_act = await ballsRewardContract.pairUserPeriodAmount("0x271F219d68d85Dda0CcdAA6a4046De749212dffd",account,curId);
        setBALLSE(Number(balls_act/10**18).toFixed(4))

        let balls2_acitve = await ballsRewardContract.viewReward("0x2d069848d0841CE4D8cE387bCBf2f511304a67B2",account,true);
        setABalls2(Number(balls2_acitve[0]*10/11/10**18).toFixed(4))
        let balls2_act = await ballsRewardContract.pairUserPeriodAmount("0x2d069848d0841CE4D8cE387bCBf2f511304a67B2",account,curId);
        setBALLSE2(Number(balls2_act/10**18).toFixed(4))

        let balls1_acitve = await ballsRewardContract.viewReward("0x3bf70f93E8BE0Cc58075E82a1873E6704CD926a6",account,true);
        setABalls1(Number(balls1_acitve[0]*10/11/10**18).toFixed(4))
        let balls1_act = await ballsRewardContract.pairUserPeriodAmount("0x3bf70f93E8BE0Cc58075E82a1873E6704CD926a6",account,curId);
        setBALLSE1(Number(balls1_act/10**18).toFixed(4))

    }
    // async function getPrice(){
    //     const DAI = new Token(ChainId.GÖRLI, "0xa827a8d0A9F60F0A09f5C7425395FD58EDfd13D5", 18)
    //     const pair = await Fetcher.fetchPairData(DAI, WETH[DAI.chainId])
    //     const route = new Route([pair], WETH[DAI.chainId])
    //     setPBALSS(route.midPrice.invert().toSignificant(7))
    // }


    function claimReward(pair:any){
        if (!chainId || !library || !account) return
        const ballsRewardContract = getBallsRewardContract(chainId, library, account);
        ballsRewardContract.getReward(pair)
        .then((response:any) => {
            console.log(response.hash)
        })
    }

    return(
        <>
            <div style={{textAlign:'center'}}>
                <img style={{width:'30%'}} src={isDark?logo_dark:logo}/>
                <TittlStyle>
                    Claim your trading rewards here!
                </TittlStyle>
            </div>
            <BoxStyle>
                <CardStyle>
                    <p>
                        <img style={{ width: '25%'}} src={require('../../assets/benefit/PokeSwap_Pikachu.svg')}/>
                    </p>
                    <div style={{fontWeight:'bold'}}>Pikachu Pool</div>
                    <div style={{fontSize:'15px',color:'red'}}>( 3.5x Rewards )</div>
                    <Detailstyle>BALLS-ETH</Detailstyle>
                    {/* <Detailstyle>Earn More PokeBalls</Detailstyle> */}
                    {/* <p style={{fontSize:'16px'}}>Total Rewards <span style={{fontSize:'20px',color:'red',fontWeight:'bold'}}>{balls}</span></p> */}
                    <div style={{marginTop:'13px'}}>
                        <ButtonStyle onClick={()=>claimReward("0x271F219d68d85Dda0CcdAA6a4046De749212dffd")}>Harvest</ButtonStyle>
                    </div>
                    <BottomBoxStyle>
                        Claimable Rewards<span style={{display:'inline-block',width:'50%',textAlign:'right'}}>{balls_a}</span>
                    </BottomBoxStyle>
                    <BottomBoxStyle>
                        Pending Volume<span style={{display:'inline-block',width:'56%',textAlign:'right'}}>{balls_e} ETH</span>
                    </BottomBoxStyle>
                </CardStyle>

                <CardStyle>
                    <p>
                        <img style={{ width: '25%'}} src={require('../../assets/benefit/PokeSwap_MewTwo.svg')}/>
                    </p>
                    <p style={{fontWeight:'bold'}}>Mewtwo Pool</p>
                    <Detailstyle>DAI-ETH</Detailstyle>
                    {/* <Detailstyle>Earn More PokeBalls</Detailstyle> */}
                    {/* <p style={{fontSize:'16px'}}>Total Rewards <span style={{fontSize:'20px',color:'red',fontWeight:'bold'}}>{balls}</span></p> */}
                    <div style={{marginTop:'13px'}}>
                        <ButtonStyle onClick={()=>claimReward("0xB5c8534D98116FC20146651503344343ad0161Ce")}>Harvest</ButtonStyle>
                    </div>
                    <BottomBoxStyle>
                        Claimable Rewards <span style={{display:'inline-block',width:'50%',textAlign:'right'}}>{dai_a}</span>
                    </BottomBoxStyle>
                    <BottomBoxStyle>
                        Pending Volume <span style={{display:'inline-block',width:'56%',textAlign:'right'}}>{dai_e} ETH</span>
                    </BottomBoxStyle>
                </CardStyle>

                <CardStyle>
                    <p>
                        <img style={{ width: '25%'}} src={require('../../assets/benefit/PokeSwap_Charmander.svg')}/>
                    </p>
                    <p style={{fontWeight:'bold'}}>Charmander Pool</p>
                    <Detailstyle>BALLS2-ETH</Detailstyle>
                    {/* <Detailstyle>Earn More PokeBalls</Detailstyle> */}
                    {/* <p style={{fontSize:'16px'}}>Total Rewards <span style={{fontSize:'20px',color:'red',fontWeight:'bold'}}>{balls}</span></p> */}
                    <div style={{marginTop:'13px'}}>
                        <ButtonStyle onClick={()=>claimReward("0x2d069848d0841CE4D8cE387bCBf2f511304a67B2")}>Harvest</ButtonStyle>
                    </div>
                    <BottomBoxStyle>
                        Claimable Rewards <span style={{display:'inline-block',width:'50%',textAlign:'right'}}>{balls_a2}</span>
                    </BottomBoxStyle>
                    <BottomBoxStyle>
                        Pending Volume <span style={{display:'inline-block',width:'56%',textAlign:'right'}}>{balls_e2} ETH</span>
                    </BottomBoxStyle>
                </CardStyle>
            </BoxStyle>

            <BoxStyle>
                <CardStyle>
                    <p>
                        <img style={{ width: '25%'}} src={require('../../assets/benefit/PokeSwap_Charizard.svg')}/>
                    </p>
                    <p style={{fontWeight:'bold'}}>Charizard Pool</p>
                    <Detailstyle>BALLS1-ETH</Detailstyle>
                    {/* <Detailstyle>Earn More PokeBalls</Detailstyle> */}
                    {/* <p style={{fontSize:'16px'}}>Total Rewards <span style={{fontSize:'20px',color:'red',fontWeight:'bold'}}>{balls}</span></p> */}
                    <div style={{marginTop:'13px'}}>
                        <ButtonStyle onClick={()=>claimReward("0x3bf70f93E8BE0Cc58075E82a1873E6704CD926a6")}>Harvest</ButtonStyle>
                    </div>
                    <BottomBoxStyle>
                        Claimable Rewards<span style={{display:'inline-block',width:'50%',textAlign:'right'}}>{balls_a1}</span>
                    </BottomBoxStyle>
                    <BottomBoxStyle>
                        Pending Volume<span style={{display:'inline-block',width:'56%',textAlign:'right'}}>{balls_e1} ETH</span>
                    </BottomBoxStyle>
                </CardStyle>

                <CardStyle>
                    <p>
                        <img style={{ width: '25%'}} src={require('../../assets/benefit/PokeSwap_Squirtle.svg')}/>
                    </p>
                    <p style={{fontWeight:'bold'}}>Squirtle Pool</p>
                    <Detailstyle>DAI-ETH</Detailstyle>
                    {/* <Detailstyle>Earn More PokeBalls</Detailstyle> */}
                    {/* <p style={{fontSize:'16px'}}>Total Rewards <span style={{fontSize:'20px',color:'red',fontWeight:'bold'}}>{balls}</span></p> */}
                    <div style={{marginTop:'13px'}}>
                        <ButtonStyle onClick={()=>claimReward("0xB5c8534D98116FC20146651503344343ad0161Ce")}>Harvest</ButtonStyle>
                    </div>
                    <BottomBoxStyle>
                        Claimable Rewards <span style={{display:'inline-block',width:'50%',textAlign:'right'}}>{dai_a}</span>
                    </BottomBoxStyle>
                    <BottomBoxStyle>
                        Pending Volume <span style={{display:'inline-block',width:'56%',textAlign:'right'}}>{dai_e} ETH</span>
                    </BottomBoxStyle>
                </CardStyle>

                <CardStyle>
                    <p>
                        <img style={{ width: '25%'}} src={require('../../assets/benefit/PokeSwap_Rhydon.svg')}/>
                    </p>
                    <p style={{fontWeight:'bold'}}>Rhydon Pool</p>
                    <Detailstyle>DAI-ETH</Detailstyle>
                    {/* <Detailstyle>Earn More PokeBalls</Detailstyle> */}
                    {/* <p style={{fontSize:'16px'}}>Total Rewards <span style={{fontSize:'20px',color:'red',fontWeight:'bold'}}>{balls}</span></p> */}
                    <div style={{marginTop:'13px'}}>
                        <ButtonStyle onClick={()=>claimReward("0xB5c8534D98116FC20146651503344343ad0161Ce")}>Harvest</ButtonStyle>
                    </div>
                    <BottomBoxStyle>
                        Claimable Rewards <span style={{display:'inline-block',width:'50%',textAlign:'right'}}>{dai_a}</span>
                    </BottomBoxStyle>
                    <BottomBoxStyle>
                        Pending Volume <span style={{display:'inline-block',width:'56%',textAlign:'right'}}>{dai_e} ETH</span>
                    </BottomBoxStyle>
                </CardStyle>
            </BoxStyle>

            <BoxStyle>
                <CardStyle>
                    <p>
                        <img style={{ width: '25%'}} src={require('../../assets/benefit/PokeSwap_Bulbasaur.svg')}/>
                    </p>
                    <p style={{fontWeight:'bold'}}>Bulbasaur Pool</p>
                    <Detailstyle>BALLS-ETH</Detailstyle>
                    {/* <Detailstyle>Earn More PokeBalls</Detailstyle> */}
                    {/* <p style={{fontSize:'16px'}}>Total Rewards <span style={{fontSize:'20px',color:'red',fontWeight:'bold'}}>{balls}</span></p> */}
                    <div style={{marginTop:'13px'}}>
                        <ButtonStyle onClick={()=>claimReward("0x271F219d68d85Dda0CcdAA6a4046De749212dffd")}>Harvest</ButtonStyle>
                    </div>
                    <BottomBoxStyle>
                        Claimable Rewards<span style={{display:'inline-block',width:'50%',textAlign:'right'}}>{balls_a}</span>
                    </BottomBoxStyle>
                    <BottomBoxStyle>
                        Pending Volume<span style={{display:'inline-block',width:'56%',textAlign:'right'}}>{balls_e} ETH</span>
                    </BottomBoxStyle>
                </CardStyle>

                <CardStyle>
                    <p>
                        <img style={{ width: '25%'}} src={require('../../assets/benefit/PokeSwap_Psyduck.svg')}/>
                    </p>
                    <p style={{fontWeight:'bold'}}>Psyduck Pool</p>
                    <Detailstyle>DAI-ETH</Detailstyle>
                    {/* <Detailstyle>Earn More PokeBalls</Detailstyle> */}
                    {/* <p style={{fontSize:'16px'}}>Total Rewards <span style={{fontSize:'20px',color:'red',fontWeight:'bold'}}>{balls}</span></p> */}
                    <div style={{marginTop:'13px'}}>
                        <ButtonStyle onClick={()=>claimReward("0xB5c8534D98116FC20146651503344343ad0161Ce")}>Harvest</ButtonStyle>
                    </div>
                    <BottomBoxStyle>
                        Claimable Rewards <span style={{display:'inline-block',width:'50%',textAlign:'right'}}>{dai_a}</span>
                    </BottomBoxStyle>
                    <BottomBoxStyle>
                        Pending Volume <span style={{display:'inline-block',width:'56%',textAlign:'right'}}>{dai_e} ETH</span>
                    </BottomBoxStyle>
                </CardStyle>

                <CardStyle>
                    <p>
                        <img style={{ width: '25%'}} src={require('../../assets/benefit/PokeSwap_Rattata.svg')}/>
                    </p>
                    <p style={{fontWeight:'bold'}}>Rattata Pool</p>
                    <Detailstyle>DAI-ETH</Detailstyle>
                    {/* <Detailstyle>Earn More PokeBalls</Detailstyle> */}
                    {/* <p style={{fontSize:'16px'}}>Total Rewards <span style={{fontSize:'20px',color:'red',fontWeight:'bold'}}>{balls}</span></p> */}
                    <div style={{marginTop:'13px'}}>
                        <ButtonStyle onClick={()=>claimReward("0xB5c8534D98116FC20146651503344343ad0161Ce")}>Harvest</ButtonStyle>
                    </div>
                    <BottomBoxStyle>
                        Claimable Rewards <span style={{display:'inline-block',width:'50%',textAlign:'right'}}>{dai_a}</span>
                    </BottomBoxStyle>
                    <BottomBoxStyle>
                        Pending Volume <span style={{display:'inline-block',width:'56%',textAlign:'right'}}>{dai_e} ETH</span>
                    </BottomBoxStyle>
                </CardStyle>
            </BoxStyle>
        </>
    )
}