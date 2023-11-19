const X={version:2,stage:null,background:10066329,width:2048,height:1099,framerate:24,totalFrames:1,assets:{england:"./res/pixi/maps/animations/england.shapes.txt",england_atlas_1:"./res/pixi/maps/animations/england_atlas_1.json"},lib:{},shapes:{},textures:{},spritesheets:[],getTexture:function(Y){if(X.textures[Y])return X.textures[Y];const D=X.spritesheets.find((X=>!!X.textures[Y]));return D?D.textures[Y]:null},setup:function(Y){const D=Y.MovieClip,C=Y.Container,A=Y.Sprite,e=Y.Graphics;X.lib.blue_wing=class extends C{constructor(){super();const Y=new A(X.getTexture("Bitmap 23"));this.ac(Y)}},X.lib.body=class extends C{constructor(){super();const Y=(new e).d(X.shapes.england[0]);this.ac(Y)}},X.lib.butterfly_blue=class extends D{constructor(){super(0,17,!0,0);const Y=new X.lib.body,D=new X.lib.blue_wing,C=new X.lib.blue_wing;this.at(Y).at(D,0,17,"0X-11.4Y-3.5A1 1X-9.646A.864 2X-7.892A.727 3X-6.137A.591 4X-4.4A.455 5X-6.119A.591 6X-7.889A.727 7X-9.658A.864 8X-11.4A1 9X-9.646A.864 10X-7.892A.727 11X-6.137A.591 12X-4.4A.455 13X-6.119A.591 14X-7.889A.727 15X-9.658A.864 16X-11.4A1").at(C,0,17,"0X15.8Y-3.7A1D3.142 1X13.979A.856 2X12.108A.713 3X10.288A.569 4X8.4A.425 5X10.24A.569 6X12.08A.713 7X13.92A.856 8X15.8A1 9X13.979A.856 10X12.108A.713 11X10.288A.569 12X8.4A.425 13X10.24A.569 14X12.08A.713 15X13.92A.856 16X15.8A1")}},X.lib.white_wing=class extends C{constructor(){super();const Y=new A(X.getTexture("Bitmap 24"));this.ac(Y)}},X.lib.butterfly_white=class extends D{constructor(){super(0,17,!0,0);const Y=new X.lib.body,D=new X.lib.white_wing,C=new X.lib.white_wing;this.at(Y).at(D,0,17,"0X-11.4Y-3.5A1 1X-9.646A.864 2X-7.892A.727 3X-6.137A.591 4X-4.4A.455 5X-6.119A.591 6X-7.889A.727 7X-9.658A.864 8X-11.4A1 9X-9.646A.864 10X-7.892A.727 11X-6.137A.591 12X-4.4A.455 13X-6.119A.591 14X-7.889A.727 15X-9.658A.864 16X-11.4A1").at(C,0,17,"0X15.8Y-3.7A1D3.142 1X13.979A.856 2X12.108A.713 3X10.288A.569 4X8.4A.425 5X10.24A.569 6X12.08A.713 7X13.92A.856 8X15.8A1 9X13.979A.856 10X12.108A.713 11X10.288A.569 12X8.4A.425 13X10.24A.569 14X12.08A.713 15X13.92A.856 16X15.8A1")}},X.lib.Rose_main=class extends C{constructor(){super();const Y=new A(X.getTexture("Rose4")).t(-29,-25);this.ac(Y)}},X.lib.bush1=class extends C{constructor(){super();const Y=new A(X.getTexture("Layer 1")).t(-62,-54.5);this.ac(Y)}},X.lib._001=class extends C{constructor(){super();const Y=new A(X.getTexture("Layer 3"));this.ac(Y)}},X.lib._003=class extends C{constructor(){super();const Y=new A(X.getTexture("Layer 5"));this.ac(Y)}},X.lib._002=class extends C{constructor(){super();const Y=new A(X.getTexture("Layer 4"));this.ac(Y)}},X.lib._004=class extends C{constructor(){super();const Y=new A(X.getTexture("Layer 6"));this.ac(Y)}},X.lib._005=class extends C{constructor(){super();const Y=new A(X.getTexture("Layer 2"));this.ac(Y)}},X.lib._006=class extends C{constructor(){super();const Y=new A(X.getTexture("Layer 0 copy")).t(0,0,1.007,1.011);this.ac(Y)}},X.lib.glow=class extends C{constructor(){super();const Y=new A(X.getTexture("glow")).t(-177,-123);this.ac(Y)}},X.lib.magic_garden=class extends D{constructor(){super(0,84,!0,0);const Y=new X.lib.glow,D=(new X.lib._006).t(45.75,54.35,.678,.678),C=new X.lib._005,A=new X.lib._004,e=new X.lib._002,t=new X.lib._003,B=new X.lib._001,s=new X.lib.bush1,n=new X.lib.Rose_main,r=new X.lib.Rose_main,i=new X.lib.Rose_main,a=new X.lib.Rose_main,c=new X.lib.Rose_main,l=new X.lib.butterfly_white,u=new X.lib.butterfly_blue;this.at(Y,0,84,"0X126.35Y96.55A.678B.678L.48WD21PA.714B.714L1 21WD21PA.678B.678L.48 42WD22PA.714B.714L1 64WD19PA.678B.678L.48").at(D).at(C,0,84,"0X42.05Y32.95A.678B.647C-.038WD19PX36.05Y27.3B.706C.053 19WD22PX42.05Y32.95B.647C-.038 41WD23PX44.5Y27.3B.708C-.094 64WD19PX42.05Y32.95B.647C-.038").at(A,0,84,"0X106.8Y101.75A.678B.678C0 1X106.933Y101.716B.679C-.002 2X107.015Y101.686B.68C-.004 3X107.096Y101.599B.681C-.006 4X107.179Y101.516B.682C-.009 5X107.258Y101.434C-.011 6X107.34Y101.35B.683C-.013 7X107.419Y101.265B.684C-.015 8X107.499Y101.18B.685C-.017 9X107.577Y101.093C-.019 10X107.655Y101.06B.686C-.021 11X107.734Y100.923B.687C-.023 12X107.811Y100.835B.688C-.026 13X107.887Y100.797B.689C-.028 14X108.015Y100.76C-.03 15X108.09Y100.673B.69C-.032 16X108.165Y100.534B.691C-.034 17X108.241Y100.444B.692C-.036 18X108.314Y100.453B.693C-.038 19X108.388Y100.364C-.04 20X108.461Y100.273B.694C-.043 21X108.534Y100.133B.695C-.045 22X108.608Y100.139B.696C-.047 23X108.678Y100.047B.697C-.049 24X108.801Y99.956C-.051 25X108.871Y99.912B.698C-.053 26X108.942Y99.816B.699C-.055 27X109.012Y99.723B.7C-.058 28X109Y99.6C-.06WD32PX106.8Y101.75B.678C0").at(e,0,84,"0X159.65Y38A.678B.678 26WD30PX163Y35.9A.688B.706C-.059 56WD27PX159.65Y38A.678B.678C0").at(t,0,84,"0X188.15Y79.35A.678B.678 9WD29PX185.65A.744B.679C.047 38WD45PX188.15A.678B.678C0").at(B,0,84,"0X93.2Y18.3A.678B.678 10WD34PX96.85Y16.3B.7C-.05 44WD34PX93.2Y18.3B.678C0").at(s,0,84,"0X48.45Y117.7A.678B.678C0WD12PB.679C-.035 12WD21PB.678C0").at(n,0,84,"0X133.85Y146.1A.409B.41C0D0 39X133.914Y146.217A.407B.407C-.014D.014 40X133.92Y146.196A.405B.405C-.028D.028 41X133.88Y146.216A.402B.402C-.041D.041 42X133.943Y146.249A.4B.4C-.055D.055 43X133.901Y146.273A.398B.398C-.069D.069 44X133.919Y146.305A.395B.395C-.083D.083 45X133.881Y146.336A.393B.393C-.096D.096 46X133.954Y146.324A.39B.391C-.11D.11 47X133.928Y146.41A.388B.388C-.124D.124 48X134.005Y146.4A.386B.386C-.138D.138 49X133.94Y146.441A.383B.383C-.152D.152 50X133.983Y146.44A.381B.381C-.165D.165 51X133.981Y146.487A.379B.379C-.179D.179 52X133.987Y146.494A.376B.376C-.193D.193 53X133.954Y146.548A.374B.374C-.207D.207 54X133.979Y146.562A.371B.372C-.22D.221 55X133.969Y146.625A.369B.369C-.234D.234 56X134.013Y146.6A.367B.367C-.248D.248 57X133.9Y146.5A.364B.364C-.262D.262WD24PX133.85Y146.1A.409B.41R0").at(r,0,84,"0X169.45Y135.2A.6B.6C-.453D.453 36Y135.25C-.451D.451 37X169.473Y135.288C-.425D.425 38X169.483Y135.287C-.399D.399 39X169.477Y135.305C-.373D.373 40X169.501Y135.338C-.346D.347 41X169.449Y135.343C-.32D.321 42X169.423Y135.317C-.294D.295 43X169.42Y135.372C-.268D.268 44X169.381Y135.352C-.242D.242 45X169.411Y135.368C-.216D.216 46X169.409Y135.37C-.19D.19 47X169.427Y135.411C-.164D.164 48X169.406Y135.347C-.138D.138 49X169.392Y135.331C-.112D.112 50X169.393Y135.366C-.086D.086 51X169.408Y135.351C-.06D.06 52X169.324Y135.403C-.034D.034 53X169.352Y135.411C-.008D.008 54X169.38Y135.39C.019D-.019 55X169.366Y135.429C.045D-.045 56X169.35Y135.25C.071D-.071 57X169.398Y135.308C.051D-.051 58X169.381Y135.313C.032D-.032 59X169.406Y135.317C.013D-.013 60X169.419Y135.315C-.007D.007 61X169.42Y135.31C-.026D.026 62X169.412Y135.295C-.046D.046 63X169.406Y135.267C-.065D.065 64X169.438Y135.288C-.084D.084 65X169.415Y135.299C-.104D.104 66X169.431Y135.301C-.123D.123 67X169.449Y135.287C-.143D.143 68X169.418Y135.26C-.162D.162 69X169.433Y135.269C-.181D.181 70X169.451Y135.263C-.201D.201 71X169.424Y135.244C-.22D.22 72X169.446Y135.253C-.239D.24 73X169.426Y135.249C-.259D.259 74X169.458Y135.271C-.278D.278 75X169.452Y135.279C-.298D.298 76X169.45Y135.264C-.317D.317 77X169.465Y135.228C-.336D.337 78X169.486Y135.27C-.356D.356 79X169.473Y135.241C-.375D.375 80Y135.236C-.395D.395 81X169.49Y135.257C-.414D.414 82X169.469Y135.254C-.433D.434 83X169.45Y135.2C-.453D.453").at(i,0,84,"0X213.45Y103.5A.449B.449C-.161D.161 1X213.507Y103.567A.447B.447C-.15D.15 2X213.478Y103.597A.445B.445C-.138D.138 3X213.456Y103.536A.442B.442C-.127D.127 4X213.5Y103.537A.44B.44C-.116D.116 5X213.452Y103.549A.438B.438C-.104D.104 6X213.47Y103.528A.436B.436C-.093D.093 7X213.496Y103.566A.433B.434C-.081D.081 8X213.49Y103.57A.431B.431C-.07D.07 9X213.491Y103.54A.429B.429C-.059D.059 10X213.512Y103.572A.427B.427C-.047D.047 11X213.437Y103.573A.425B.425C-.036D.036 12X213.536Y103.536A.422B.423C-.025D.025 13X213.54Y103.572A.42B.42C-.013D.013 14X213.518Y103.568A.418B.418C-.002D.002 15X213.558Y103.585A.416B.416C.01D-.01 16X213.508Y103.569A.414B.414C.021D-.021 17X213.526Y103.568A.411B.412C.032D-.032 18X213.516Y103.59A.409B.409C.044D-.044 19X213.52Y103.579A.407B.407C.055D-.055 20X213.536Y103.589A.405B.405C.066D-.066 21X213.516Y103.561A.403B.403C.078D-.078 22X213.528Y103.559A.4B.4C.089D-.089 23X213.4Y103.5A.398B.398C.101D-.101 24X213.493Y103.58A.4B.4C.09D-.09 25X213.439Y103.519A.402B.403C.079D-.079 26X213.452Y103.534A.405B.405C.068D-.068 27X213.427Y103.549A.407B.407C.057D-.057 28X213.465Y103.531A.409B.409C.046D-.046 29X213.503Y103.563A.411B.411C.035D-.035 30X213.467Y103.515A.413B.413C.024D-.024 31X213.438Y103.522A.415B.415C.013D-.013 32X213.461Y103.531A.417B.417C.002D-.003 33X213.502Y103.559A.419B.419C-.008D.008 34X213.458Y103.491A.421B.422C-.019D.019 35X213.471Y103.53A.424B.424C-.03D.03 36X213.436Y103.519A.426B.426C-.041D.041 37X213.414Y103.526A.428B.428C-.052D.052 38X213.408Y103.482A.43B.43C-.063D.063 39X213.448Y103.487A.432B.432C-.074D.074 40X213.41Y103.504A.434B.434C-.085D.085 41X213.431Y103.528A.436B.436C-.096D.096 42X213.398Y103.544A.438B.438C-.107D.107 43X213.435Y103.519A.44B.441C-.117D.117 44X213.427Y103.5A.443B.443C-.128D.128 45X213.431Y103.529A.445B.445C-.139D.139 46X213.386Y103.505A.447B.447C-.15D.15 47X213.45Y103.5A.449B.449C-.161D.161").at(a,0,84,"0X148.5Y62.7A.678B.678C0D0 26X148.529Y62.764A.677B.677C-.024D.024 27X148.537Y62.777A.675B.675C-.048D.048 28X148.571Y62.737A.674B.674C-.071D.071 29X148.533A.672B.672C-.095D.095 30X148.57Y62.78A.67B.671C-.119D.119 31X148.538Y62.766A.669B.669C-.143D.143 32X148.592Y62.786A.667B.668C-.167D.167 33X148.525Y62.798A.666B.666C-.19D.19 34X148.543Y62.791A.664B.664C-.214D.214 35X148.598Y62.769A.663B.663C-.238D.238 36X148.546Y62.736A.661B.661C-.262D.262 37X148.53Y62.732A.66B.66C-.285D.286 38X148.506Y62.706A.658B.658C-.309D.309 39X148.531Y62.709A.657B.657C-.333D.333 40X148.496Y62.74A.655B.655C-.357D.357 41X148.512Y62.7A.654B.654C-.381D.381 42X148.525Y62.683A.652B.652C-.404D.405 43X148.541Y62.691A.65B.651C-.428D.429 44X148.514Y62.725A.649B.649C-.452D.452 45X148.537Y62.732A.647B.648C-.476D.476 46X148.524Y62.711A.646B.646C-.5D.5 47X148.45Y62.7A.644B.644C-.523D.524WD22PX148.5A.678B.678R0").at(c,0,84,"0X46.15Y116.85A.51B.51C.2D-.2 1X46.198Y116.873C.243D-.243 2X46.204Y116.926C.287D-.287 3X46.151Y116.919C.331D-.331 4X46.179Y116.952C.374D-.374 5X46.135Y116.935C.418D-.418 6X46.207Y116.917C.461D-.462 7X46.186Y116.955C.505D-.505 8X46.215Y116.96C.549D-.549 9X46.184Y116.933C.592D-.593 10X46.187Y116.938C.636D-.636 11X46.165Y116.974C.68D-.68 12X46.1Y116.9C.723D-.724 13X46.121Y116.958C.698D-.699 14X46.116Y116.946C.673D-.674 15X46.14Y116.964C.648D-.649 16X46.136Y116.954C.623D-.624 17X46.111Y116.97C.599D-.599 18X46.118Y116.959C.574D-.574 19X46.11Y116.924C.549D-.549 20X46.132Y116.963C.524D-.524 21X46.142Y116.922C.499D-.499 22X46.14Y116.907C.474D-.474 23X46.081Y116.915C.449D-.449 24X46.11Y116.943C.424D-.424 25X46.085Y116.942C.399D-.399 26X46.104Y116.915C.374D-.374 27X46.123Y116.912C.349D-.349 28X46.091Y116.927C.324D-.325 29X46.06Y116.917C.299D-.3 30X46.082Y116.926C.274D-.275 31X46.066Y116.912C.25D-.25 32X46.103Y116.916C.225D-.225 33X46.15Y116.85C.2D-.2").at(l,0,84,"0X87.9Y64.55A1.091B1.092C-.157D.157 1X82.8Y51.3A1.09B1.091C-.117D.117 2X68.15Y48.25B1.09C-.074D.074 3X62.25Y36.2C-.032D.032 4X76.15Y32.2C-.249D.25 5X91.6Y29.35A1.089C-.472D.472 6X92.35Y18.4B1.089C-.694D.695 7X101.85Y12.3C-.914D.914 8X116.25Y18.7A1.09C-1.137D1.137 9X128.8Y17.15A1.092B1.091C-1.356D1.356 10X142.6Y14.2A1.091B1.09C-1.53D1.53 11X152.4Y26.3C4.582D1.701 12X165.75Y33.6A1.09C4.411D1.872 13X179.95Y32.6A1.089B1.089C4.24D2.042 14X191.15Y38.1A1.09B1.09C4.068D2.215 15X197.5Y52.1A1.088B1.088C3.921D2.362 16X207.35Y45.75C3.772D2.511 17X220Y43.55C3.623D2.66 18X229.9Y51.75B1.089C3.474D2.809 19X241.35Y59.4A1.089C3.325D2.958 20X254.1Y65.1C3.177D3.106 21X261.05Y76.95A1.09B1.09C3.029D-3.029 22X251.35Y88.75A1.088B1.088C2.224D-2.223 23X235.4Y86.75A1.089B1.089C1.415D-1.415 24X230.8Y68.1C.612D-.613 25X226.75Y58.3A1.088B1.088C1.265D-1.266 26X215.2Y60.75A1.086B1.086C1.917D-1.917 27X210Y71.3A1.087B1.088C2.572D-2.571 28X201.45Y81.95A1.085B1.085C1.926D-1.926 29X186.95Y75.15A1.086B1.086C1.282D-1.282 30X176.9Y69.85A1.085B1.085C1.773D-1.772 31X167.05Y74.7A1.084B1.084C2.263D-2.263 32X169.35Y90.05A1.086B1.086C2.757D-2.756 33X164.35Y103.3A1.085B1.085C2.236D-2.236 34X150.55Y109.1C1.715D-1.715 35X134.7Y105.2A1.086B1.086C1.195D-1.195 36X136.7Y88.7A1.088B1.088C.673D-.673 37X125Y86.05A1.087B1.087C1.06D-1.06 38X113.2Y94.35A1.088B1.088C1.445D-1.445 39X100Y95.65C.911D-.911 40X87.95Y93.1C.377D-.377 41X84.7Y79.35A1.091B1.092C-.157D.157 42X87.9Y64.55 43X82.8Y51.3A1.09B1.091C-.117D.117 44X68.15Y48.25B1.09C-.074D.074 45X62.25Y36.2C-.032D.032 46X76.15Y32.2C-.249D.25 47X91.6Y29.35A1.089C-.472D.472 48X92.35Y18.4B1.089C-.694D.695 49X101.85Y12.3C-.914D.914 50X116.25Y18.7A1.09C-1.137D1.137 51X128.8Y17.15A1.092B1.091C-1.356D1.356 52X142.6Y14.2A1.091B1.09C-1.53D1.53 53X152.4Y26.3C4.582D1.701 54X165.75Y33.6A1.09C4.411D1.872 55X179.95Y32.6A1.089B1.089C4.24D2.042 56X191.15Y38.1A1.09B1.09C4.068D2.215 57X197.5Y52.1A1.088B1.088C3.921D2.362 58X207.35Y45.75C3.772D2.511 59X220Y43.55C3.623D2.66 60X229.9Y51.75B1.089C3.474D2.809 61X241.35Y59.4A1.089C3.325D2.958 62X254.1Y65.1C3.177D3.106 63X261.05Y76.95A1.09B1.09C3.029D-3.029 64X251.35Y88.75A1.088B1.088C2.224D-2.223 65X235.4Y86.75A1.089B1.089C1.415D-1.415 66X230.8Y68.1C.612D-.613 67X226.75Y58.3A1.088B1.088C1.265D-1.266 68X215.2Y60.75A1.086B1.086C1.917D-1.917 69X210Y71.3A1.087B1.088C2.572D-2.571 70X201.45Y81.95A1.085B1.085C1.926D-1.926 71X186.95Y75.15A1.086B1.086C1.282D-1.282 72X176.9Y69.85A1.085B1.085C1.773D-1.772 73X167.05Y74.7A1.084B1.084C2.263D-2.263 74X169.35Y90.05A1.086B1.086C2.757D-2.756 75X164.35Y103.3A1.085B1.085C2.236D-2.236 76X150.55Y109.1C1.715D-1.715 77X134.7Y105.2A1.086B1.086C1.195D-1.195 78X136.7Y88.7A1.088B1.088C.673D-.673 79X125Y86.05A1.087B1.087C1.06D-1.06 80X113.2Y94.35A1.088B1.088C1.445D-1.445 81X100Y95.65C.911D-.911 82X87.95Y93.1C.377D-.377 83X84.7Y79.35A1.091B1.092C-.157D.157").at(u,0,84,"0X224.15Y102.4A1.091B1.091C2.199D-2.199 1X211.35Y99.75A1.09B1.089C1.541D-1.541 2X202.05Y92.45A1.089C.889D-.889 3X199.45Y81.2B1.09C.234D-.234 4X194.85Y74.75A1.087B1.087C.823D-.824 5X189.6Y70.75A1.088B1.088C1.413D-1.413 6X182.75Y72.65C2D-2 7X175.95Y79.3A1.086B1.086C2.031D-2.031 8X170.85Y87.95A1.084B1.084C2.066D-2.065 9X164.1Y94.75A1.086B1.086C2.098D-2.098 10X152.65Y92.45C1.26D-1.26 11X145.85Y84.85A1.087B1.087C.417D-.417 12X141.1Y78.7A1.085B1.085C.932D-.933 13X135.95Y74.2C1.444D-1.445 14X130.1Y74.45A1.086C1.957D-1.957 15X122Y78.85A1.084B1.084C1.637D-1.637 16X112.6Y81.15A1.085C1.317D-1.317 17X103.2Y78.95A1.084C.993D-.993 18X96.85Y71.65A1.083B1.083C.674D-.674 19X91.8Y63.05C.351D-.351 20X87.5Y54.6A1.084B1.084C.031D-.031 21X88.55Y44.2A1.085B1.085C-.288D.288 22X96.25Y36.2A1.083B1.083C-.835D.835 23X108.3Y35.15A1.084B1.084C-1.386D1.386 24X119.1Y39.75A1.085B1.085C4.351D1.932 25X127.3Y41.65B1.084C4.691D1.592 26X134.2Y44.85A1.083B1.083C-1.251D1.251 27X141.7Y41.3A1.085B1.085C-.909D.909 28X146.15Y32.45A1.083B1.083C-.835D.836 29X152Y26.15A1.084B1.084C-.766D.766 30X163.75Y23.95A1.083B1.083C-1.386D1.386 31X174.7Y26.3A1.084B1.084C4.284D1.999 32X182.6Y31.5A1.085B1.085C3.662D2.62 33X186.6Y39.7A1.083B1.083C3.689D2.594 34X186.7Y49.2A1.085B1.085C3.717D2.566 35X197.65Y46.35C4.267D2.016 36X206.9Y41.1A1.087B1.087C-1.469D1.469 37X215.5Y50C4.398D1.885 38X222.3Y60.3C3.978D2.305 39X229.4Y67.6A1.088B1.088C3.558D2.725 40X233.45Y76.25A1.09B1.09C3.138D-3.138 41X230.7Y86.75A1.091B1.091C2.723D-2.723 42X224.15Y102.4C2.199D-2.199 43X211.35Y99.75A1.09B1.089C1.541D-1.541 44X202.05Y92.45A1.089C.889D-.889 45X199.45Y81.2B1.09C.234D-.234 46X194.85Y74.75A1.087B1.087C.823D-.824 47X189.6Y70.75A1.088B1.088C1.413D-1.413 48X182.75Y72.65C2D-2 49X175.95Y79.3A1.086B1.086C2.031D-2.031 50X170.85Y87.95A1.084B1.084C2.066D-2.065 51X164.1Y94.75A1.086B1.086C2.098D-2.098 52X152.65Y92.45C1.26D-1.26 53X145.85Y84.85A1.087B1.087C.417D-.417 54X141.1Y78.7A1.085B1.085C.932D-.933 55X135.95Y74.2C1.444D-1.445 56X130.1Y74.45A1.086C1.957D-1.957 57X122Y78.85A1.084B1.084C1.637D-1.637 58X112.6Y81.15A1.085C1.317D-1.317 59X103.2Y78.95A1.084C.993D-.993 60X96.85Y71.65A1.083B1.083C.674D-.674 61X91.8Y63.05C.351D-.351 62X87.5Y54.6A1.084B1.084C.031D-.031 63X88.55Y44.2A1.085B1.085C-.288D.288 64X96.25Y36.2A1.083B1.083C-.835D.835 65X108.3Y35.15A1.084B1.084C-1.386D1.386 66X119.1Y39.75A1.085B1.085C4.351D1.932 67X127.3Y41.65B1.084C4.691D1.592 68X134.2Y44.85A1.083B1.083C-1.251D1.251 69X141.7Y41.3A1.085B1.085C-.909D.909 70X146.15Y32.45A1.083B1.083C-.835D.836 71X152Y26.15A1.084B1.084C-.766D.766 72X163.75Y23.95A1.083B1.083C-1.386D1.386 73X174.7Y26.3A1.084B1.084C4.284D1.999 74X182.6Y31.5A1.085B1.085C3.662D2.62 75X186.6Y39.7A1.083B1.083C3.689D2.594 76X186.7Y49.2A1.085B1.085C3.717D2.566 77X197.65Y46.35C4.267D2.016 78X206.9Y41.1A1.087B1.087C-1.469D1.469 79X215.5Y50C4.398D1.885 80X222.3Y60.3C3.978D2.305 81X229.4Y67.6A1.088B1.088C3.558D2.725 82X233.45Y76.25A1.09B1.09C3.138D-3.138 83X230.7Y86.75A1.091B1.091C2.723D-2.723")}},X.lib.smoke_mc=class extends D{constructor(){super(0,16,!0,0);const Y=new A(X.getTexture("Bitmap 1")),D=new A(X.getTexture("Bitmap 2")),C=new A(X.getTexture("Bitmap 3")),e=new A(X.getTexture("Bitmap 4")),t=new A(X.getTexture("Bitmap 5")),B=new A(X.getTexture("Bitmap 6")),s=new A(X.getTexture("Bitmap 7")),n=new A(X.getTexture("Bitmap 8")).t(-6,-44);this.at(Y,0,2,"0X-8Y-46").at(D,2,2,"2X-7Y-46").at(C,4,2,"4X-8Y-48").at(e,6,2,"6X-7Y-48").at(t,8,2,"8X-7Y-50").at(B,10,2,"10X-6Y-51").at(s,12,2,"12X-5Y-48").at(n,14,2)}},X.lib.blue_wing_1=class extends C{constructor(){super();const Y=new A(X.getTexture("Bitmap 20"));this.ac(Y)}},X.lib.butterfly_blue_1=class extends D{constructor(){super(0,17,!0,0);const Y=new A(X.getTexture("Bitmap 19")),D=new A(X.getTexture("Bitmap 10")),C=new A(X.getTexture("Bitmap 11")),e=new A(X.getTexture("Bitmap 12")),t=new A(X.getTexture("Bitmap 13")),B=new X.lib.blue_wing_1,s=new X.lib.blue_wing_1;this.at(Y,0,4).at(D,4,4).at(C,8,4).at(e,12,4).at(t,16,1).at(B,0,17,"0X-11.4Y-3.5A1 1X-9.646A.864 2X-7.892A.727 3X-6.137A.591 4X-4.4A.455 5X-6.119A.591 6X-7.889A.727 7X-9.658A.864 8X-11.4A1 9X-9.646A.864 10X-7.892A.727 11X-6.137A.591 12X-4.4A.455 13X-6.119A.591 14X-7.889A.727 15X-9.658A.864 16X-11.4A1").at(s,0,17,"0X15.8Y-3.7A1D3.142 1X13.979A.856 2X12.108A.713 3X10.288A.569 4X8.4A.425 5X10.24A.569 6X12.08A.713 7X13.92A.856 8X15.8A1 9X13.979A.856 10X12.108A.713 11X10.288A.569 12X8.4A.425 13X10.24A.569 14X12.08A.713 15X13.92A.856 16X15.8A1")}},X.lib.white_wing_1=class extends C{constructor(){super();const Y=new A(X.getTexture("Bitmap 21"));this.ac(Y)}},X.lib.butterfly_white_1=class extends D{constructor(){super(0,17,!0,0);const Y=new A(X.getTexture("Bitmap 14")),D=new A(X.getTexture("Bitmap 15")),C=new A(X.getTexture("Bitmap 16")),e=new A(X.getTexture("Bitmap 17")),t=new A(X.getTexture("Bitmap 18")),B=new X.lib.white_wing_1,s=new X.lib.white_wing_1;this.at(Y,0,4).at(D,4,4).at(C,8,4).at(e,12,4).at(t,16,1).at(B,0,17,"0X-11.4Y-3.5A1 1X-9.646A.864 2X-7.892A.727 3X-6.137A.591 4X-4.4A.455 5X-6.119A.591 6X-7.889A.727 7X-9.658A.864 8X-11.4A1 9X-9.646A.864 10X-7.892A.727 11X-6.137A.591 12X-4.4A.455 13X-6.119A.591 14X-7.889A.727 15X-9.658A.864 16X-11.4A1").at(s,0,17,"0X15.8Y-3.7A1D3.142 1X13.979A.856 2X12.108A.713 3X10.288A.569 4X8.4A.425 5X10.24A.569 6X12.08A.713 7X13.92A.856 8X15.8A1 9X13.979A.856 10X12.108A.713 11X10.288A.569 12X8.4A.425 13X10.24A.569 14X12.08A.713 15X13.92A.856 16X15.8A1")}},X.lib.buterfly_mc=class extends D{constructor(){super(0,42,!0,0);const Y=new X.lib.butterfly_white_1,D=new X.lib.butterfly_blue_1;this.at(Y,0,42,"0X434.85Y314.9A.621B.621C0D0 1X430.8Y307.9C.04D-.04 2X422.3Y307.5A.62B.62C.083D-.083 3X417.9Y301.25C.125D-.125 4X425.35Y297.75C-.093D.093 5X433.75Y294.8C-.315D.315 6X433.25Y288.55C-.538D.538 7X438Y284.25C-.757D.757 8X446.7Y286.6C-.98D.98 9X453.6Y284.6A.621B.621C-1.199D1.199 10X461.1Y281.75A.62B.62C-1.374D1.374 11X467.65Y287.65A.621B.621C-1.544D1.544 12X475.85Y290.6A.62B.62C4.568D1.715 13X483.75Y288.75C4.398D1.886 14X490.55Y290.85C4.225D2.058 15X495.35Y298.15A.619B.619C4.078D2.205 16X500.3Y293.75C3.929D2.354 17X507.2Y291.35C3.78D2.503 18X513.5Y295.1C3.631D2.652 19X520.65Y298.4A.62B.62C3.482D2.801 20X528.3Y300.45C3.334D2.949 21X533.3Y306.5C3.186D3.097 22X528.9Y314A.619B.619C2.38D-2.38 23X519.7Y314.25A.62B.62C1.572D-1.572 24X515.45Y304.2A.619B.619C.769D-.769 25X512.3Y299.05C1.422D-1.422 26X506.05Y301.45A.618B.618C2.074D-2.074 27X504.1Y307.85A.619B.619C2.728D-2.728 28X500.2Y314.6A.618B.618C2.083D-2.083 29X491.45Y312.1C1.439D-1.439 30X485.35Y309.95A.617B.617C1.929D-1.929 31X480.25Y313.55C2.42D-2.42 32X482.9Y322A.618B.618C2.913D-2.913 33X481.25Y329.9A.617B.617C2.393D-2.393 34X474Y334.35C1.872D-1.872 35X464.75Y333.55A.618B.618C1.352D-1.352 36X464.4Y324.15A.619B.619C.83D-.83 37X457.6Y323.7A.618B.618C1.217D-1.217 38X451.7Y329.4A.619B.619C1.602D-1.602 39X444.4Y331.3C1.068D-1.068 40X437.4Y330.95C.534D-.534 41X434.35Y323.5A.621B.621C0D0").at(D,0,42,"0X514.8Y324.05A.621B.621C2.356D-2.356 1X507.35Y323.7A.62B.62C1.698D-1.698 2X501.45Y320.45A.619B.619C1.046D-1.046 3X499Y314.35A.62B.62C.391D-.391 4X495.85Y311.1A.619B.619C.98D-.98 5X492.55Y309.35C1.57D-1.57 6X488.9Y311.05C2.157D-2.157 7X485.6Y315.35A.618B.618C2.188D-2.188 8X483.55Y320.7A.617B.617C2.222D-2.222 9X480.35Y325.05A.618B.618C2.255D-2.255 10X473.7Y324.8C1.417D-1.417 11X469.2Y321.15C.574D-.574 12X466Y318.15A.617B.617C1.089D-1.089 13X462.7Y316.1C1.601D-1.601 14X459.45Y316.7A.618B.618C2.114D-2.114 15X455.25Y319.9A.617B.617C1.794D-1.794 16X450.2Y322.05C1.474D-1.474 17X444.7Y321.65C1.15D-1.15 18X440.5Y318.1A.616B.616C.831D-.831 19X436.9Y313.7C.508D-.508 20X433.7Y309.35A.617B.617C.188D-.188 21X433.4Y303.45C-.131D.131 22X437Y298.25A.616B.616C-.678D.678 23X443.7Y296.55A.617B.617C-1.229D1.229 24X450.2Y298.2C4.508D1.775 25X454.95Y298.55C-1.435D1.435 26X459.1Y299.7A.616B.616C-1.094D1.094 27X463Y297.05A.617B.617C-.752D.752 28X464.7Y291.7A.616B.616C-.679D.679 29X467.45Y287.6A.617B.617C-.609D.609 30X473.85Y285.35A.616B.616C-1.229D1.229 31X480.2Y285.7A.617B.617C4.441D1.843 32X485.1Y287.9C3.819D2.464 33X488.1Y292.15A.616B.616C3.846D2.437 34X489Y297.5A.617B.617C3.874D2.41 35X494.95Y294.9C4.424D1.86 36X499.65Y291.15A.618B.618C-1.312D1.312 37X505.3Y295.35A.619B.619C4.555D1.729 38X510Y300.55C4.135D2.148 39X514.65Y304.05C3.715D2.568 40X517.7Y308.55A.62B.62C3.295D2.988 41X517.1Y314.7A.621B.621C2.88D-2.88")}},X.lib.firefly=class extends C{constructor(){super();const Y=new A(X.getTexture("firefly")).t(-2.1,-13,1,1,0,-.545,.545);this.ac(Y)}},X.lib.bus=class extends C{constructor(){super();const Y=new A(X.getTexture("bus"));this.ac(Y)}},X.lib.wheel=class extends C{constructor(){super();const Y=new A(X.getTexture("wheel"));this.ac(Y)}},X.lib.bus_mc=class extends D{constructor(){super(0,33,!0,0,{idle:0});const Y=(new X.lib.wheel).t(219,161.1,.824,.824),D=(new X.lib.wheel).t(98.5,194.55),C=new X.lib.bus,A=new X.lib.firefly,e=new X.lib.firefly;this.at(Y).at(D).at(C,0,33,"0Y0B1 1Y1.05B.997 2Y2B.995 3Y3B.992 4Y4.05B.99 5Y5B.987 6Y6B.985 7Y5.409B.986 8Y4.819B.988 9Y4.228B.989 10Y3.638B.991 11Y2.997B.992 12Y2.406B.994 13Y1.816B.995 14Y1.225B.997 15Y.635B.998 16Y0B1 17Y1.05B.997 18Y2B.995 19Y3B.992 20Y4.05B.99 21Y5B.987 22Y6B.985 23Y5.409B.986 24Y4.819B.988 25Y4.228B.989 26Y3.638B.991 27Y2.997B.992 28Y2.406B.994 29Y1.816B.995 30Y1.225B.997 31Y.635B.998 32Y0B1").at(A,0,33,"0X11Y174.55A2.01B2.01L.06 1L.11 2L.16 3L.21 4L.27 5L.32 6L.38 7L.43 8L.48 9L.53 10L.58 11L.64 12L.69 13L.74 14L.79 15L.85 16L.9 17L.85 18L.79 19L.74 20L.69 21L.64 22L.58 23L.53 24L.48 25L.43 26L.38 27L.32 28L.27 29L.21 30L.16 31L.11 32L.06").at(e,0,33,"0X78.85Y208.3A2.342B2.342L.06 1L.11 2L.16 3L.21 4L.27 5L.32 6L.38 7L.43 8L.48 9L.53 10L.58 11L.64 12L.69 13L.74 14L.79 15L.85 16L.9 17L.85 18L.79 19L.74 20L.69 21L.64 22L.58 23L.53 24L.48 25L.43 26L.38 27L.32 28L.27 29L.21 30L.16 31L.11 32L.06")}},X.lib.phone=class extends C{constructor(){super();const Y=new A(X.getTexture("phone"));this.ac(Y)}},X.lib.shadow=class extends C{constructor(){super();const Y=new A(X.getTexture("shadow"));this.ac(Y)}},X.lib.phone_mc=class extends D{constructor(){super(0,100,!0,0,{idle:0});const Y=new X.lib.shadow,D=new X.lib.phone;this.at(Y,0,100,"0X38.85Y210.05A1C-.03D.03L1 1X38.865Y210.03A.992D.028L.98 2X38.877Y210.065A.985D.025L.95 3X38.889Y210.051A.977D.023L.93 4X38.9Y210.038A.97D.021L.9 5X38.912Y210.027A.962D.018L.88 6X38.873Y210.071A.955D.016L.86 7X38.884Y210.062A.947D.014L.83 8X38.894Y210.055A.94D.011L.8 9X38.85Y210.05A.932D.009L.78 10X38.907Y210.059A.94D.011L.8 11X38.921Y210.072A.947D.014L.83 12X38.885Y210.087A.955D.016L.86 13X38.948Y210.053A.962D.018L.88 14X38.961Y210.072A.97D.021L.9 15X38.923Y210.092A.977D.023L.93 16X38.933Y210.066A.985D.025L.95 17X38.948Y210.088A.992D.028L.98 18X38.85Y210.05A1D.03L1 19X38.894Y210.038A.986D.026L.96 20X38.886Y210.033A.973D.022L.91 21X38.877Y210.036A.959D.017L.87 22X38.866Y210.041A.946D.013L.82 23X38.85Y210.05A.932D.009L.78 24X38.898Y210.089A.935D.01L.8 25X38.903Y210.083A.939D.011L.83 26X38.907Y210.076A.942D.012L.85 27X38.912Y210.067A.945L.88 28X38.85Y210.05A.948D.013L.9 29X38.886Y210.057A.959D.017L.92 30X38.878Y210.07A.969D.02L.94 31X38.917Y210.091A.979D.023L.96 32X38.909Y210.059A.99D.027L.98 33X38.85Y210.05A1D.03L1").at(D,0,100,"0X0Y0C0D0 1X-1.3Y.5C.005D-.005 2X-2.6Y.95C.01D-.01 3X-3.95Y1.45C.014D-.014 4X-5.25Y1.95C.019D-.019 5X-6.6Y2.45C.024D-.024 6X-7.9Y2.95C.029D-.029 7X-9.2Y3.45C.033D-.033 8X-10.5Y3.95C.038D-.038 9X-11.85Y4.45C.043D-.043 10X-8.256Y3.046C.03D-.03 11X-4.661Y1.692C.017D-.017 12X-1.064Y.386C.004D-.004 13X2.586Y-.869C-.009D.009 14X6.187Y-2.076C-.022D.022 15X9.84Y-3.233C-.035D.035 16X13.496Y-4.34C-.048D.048 17X17.203Y-5.399C-.061D.061 18X20.85Y-6.45C-.074D.074 19X16.396Y-5.225C-.058D.058 20X11.987Y-3.899C-.042D.042 21X7.574Y-2.521C-.027D.027 22X3.155Y-1.042C-.011D.011 23X-1.3Y.45C.005D-.005 24X1.096Y-.361C-.004D.004 25X3.542Y-1.222C-.013D.013 26X5.939Y-1.984C-.021D.021 27X8.385Y-2.795C-.03D.03 28X10.9Y-3.55C-.039D.039 29X8.722Y-2.834C-.031D.031 30X6.544Y-2.118C-.023D.023 31X4.415Y-1.401C-.015D.015 32X2.235Y-.685C-.008D.008 33X0Y0C0D0")}},X.lib.arrow_3=class extends C{constructor(){super();const Y=new A(X.getTexture("arrow_3"));this.ac(Y)}},X.lib.arrow_2=class extends C{constructor(){super();const Y=new A(X.getTexture("arrow_2"));this.ac(Y)}},X.lib.arrow_1=class extends C{constructor(){super();const Y=new A(X.getTexture("arrow_1"));this.ac(Y)}},X.lib.watch_mc=class extends D{constructor(){super(0,300,!0,0,{idle:0});const Y=new X.lib.arrow_1,D=(new X.lib.arrow_2).t(-6,37.6,1,1,0,.706,-.706),C=(new X.lib.arrow_3).t(21.5,24.5);this.at(Y,0,300,"0X13.85Y1.8C.461D-.461 24X26.75Y-1.7C.069D-.069 49X42.05Y1.85C-.431D.431 74X56Y11.5C-.941D.941 99X63.05Y30.95C4.688D1.595 124X57.65Y52.35C4.073D2.21 149X43.85Y63.3C3.549D2.734 174X29.8Y66.05C3.126D-3.126 199X13.8Y61.8C2.634D-2.634 224X1.4Y49.9C2.123D-2.123 249X-3.9Y33.55C1.595D-1.595 274X.65Y15.55C1.042D-1.042").at(D).at(C)}},X.lib.sign=class extends C{constructor(){super();const Y=new A(X.getTexture("sign"));this.ac(Y)}},X.lib.sign_mc=class extends D{constructor(){super(0,40,!0,0,{idle:0});const Y=new X.lib.sign;this.at(Y,0,40,"0L0 1L.03 2L.06 3L.09 4L.12 5L.14 6L.18 7L.2 8L.23 9L.26 10L.29 11L.32 12L.35 13L.38 14L.41 15L.43 16L.46 17L.49 18L.52 19L.55 20L.52 21L.5 22L.47 23L.44 24L.41 25L.39 26L.36 27L.33 28L.3 29L.28 30L.25 31L.22 32L.19 33L.16 34L.14 35L.11 36L.08 37L.05 38L.03 39L0")}};X.lib.england=class extends D{constructor(){super(0,1,!0,24);const Y=(new X.lib.sign_mc).t(951.8,206.55,.678,.678),D=(new X.lib.watch_mc).t(725.25,257.8,.619,.683,0,.038,.181),C=(new X.lib.watch_mc).t(803.5,258.1,.678,.678),A=(new X.lib.phone_mc).t(1000.9,423.6,.678,.678),e=(new X.lib.bus_mc).t(1059.6,158.7,.678,.678),t=(new X.lib.buterfly_mc).t(1362.25,70.15,1.138,1.138,0,.262,2.88),B=(new X.lib.buterfly_mc).t(-62.45,229.3,1.344,1.344,0,.262,-.262),s=(new X.lib.smoke_mc).t(1198.2,367.15,1.172,1.232),n=(new X.lib.smoke_mc).t(1340,364.1,1.715,1.802),r=(new X.lib.magic_garden).t(1723.2,660.9);this.ac(Y,D,C,A,e,t,B,s,n,r)}};X.stage=X.lib.england}};export default X;