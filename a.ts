import * as _ from "lodash";

const daohaus = {
  data: {
    members: [
      {
        id: "0x0e5a503842c947762e66c42f8a773757edeb2315-0x439116ccdcb4c7ddc68dbc1cc16332e955f1824f"
      },
      {
        id: "0x148daa26808201add646d16c5c0a4d0e60d8847c-0xf3d9281fa183b74f32b96e1c5244596045f4ede8"
      },
      {
        id: "0x14bf7c8ef3a9484522f610e1904ad23236289eaa-0x52ab58c10e9187a79da50f892ea4801aad58cb00"
      },
      {
        id: "0x14f00110956d2f6171afc16baab4c0bac334801f-0x0978800656f7d3c86432c470a747bf494b3fe6a3"
      },
      {
        id: "0x19cf6f42436acdae68cdec522320b18b36bfda60-0x0d97e169bd4f99418cab729ba5a84df44ea44f85"
      },
      {
        id: "0x1c4aa92cd9ba7e6a40d19660f94ee8d23eb56639-0x1dc96f305645b5ac12dda5151eb6704677c7db12"
      },
      {
        id: "0x23bfa86f33660a5135dac82bf3804c153b1ab72f-0xf6c50d8ed476ad036fddbc1877e4af90f0282295"
      },
      {
        id: "0x2f2f18904ed01112a5d3c51f6f393d893ba7d6a7-0xda93c8286c47990e922406016f7eeddbe41d9702"
      },
      {
        id: "0x2fad8cd84c6d3e668dd56601bbb7ac0fda4f5e68-0xbaf6e57a3940898fd21076b139d4ab231dcbbc5f"
      },
      {
        id: "0x375cc4d070482484e6c351b9d2de244b3076bf7d-0x109bb92503c567ac52647d507849aa9429077bf9"
      },
      {
        id: "0x3b1c5ca91ec6ceda5ef3cef8abc275f63ac35232-0xac03bb73b6a9e108530aff4df5077c2b3d481e5a"
      },
      {
        id: "0x3bcf65756463c54e15fa26b8f441cdd927b66207-0xb6dacfc9e6443f2546e9285ba4ae6359cdc20727"
      },
      {
        id: "0x54af0987ddead435a6fcb2206a2ba97f38309ab0-0xebf96b95e2d08651856ff82771876338ac289f06"
      },
      {
        id: "0x5bcaae60f557b456a902b91fa49fed009eb2d0bf-0x6a66744d7d6266a7c7c7176d64ba4375d8b0f94b"
      },
      {
        id: "0x6c9b4f1bdddd7704a26a5caf5242e88501dc5f0b-0xd3e9d60e4e4de615124d5239219f32946d10151d"
      },
      {
        id: "0x72f7afd4ce96171c30f1a5260cbf7faba32bc3fa-0x99105365d51250c71fbb0d59113a80996b301cbd"
      },
      {
        id: "0x751ce4ba67a135ba9cb8e689dfd29c46859b9249-0xa8c47a6a43e9b211e05eb259a9abdb8472971314"
      },
      {
        id: "0x7db1f449e67cc4ab38887a364711feea1b2a8101-0xf3d9281fa183b74f32b96e1c5244596045f4ede8"
      },
      {
        id: "0x80815f046d055df3e90828e351d382ad15e61cab-0xbaf6e57a3940898fd21076b139d4ab231dcbbc5f"
      },
      {
        id: "0x8a6b2d789c00c6b0972320df6e558268fed8a5a1-0xd26a3f686d43f2a62ba9eae2ff77e9f516d945b9"
      },
      {
        id: "0x8e0319619aa8be2ee519606b748013c2a7e626e8-0xa8c47a6a43e9b211e05eb259a9abdb8472971314"
      },
      {
        id: "0x91a0dab8b10fede56f23ab133628ab7f3c65a9b6-0xbaf6e57a3940898fd21076b139d4ab231dcbbc5f"
      },
      {
        id: "0x96c8c63352d416378040a31ab8a231dd8104da58-0xd3e9d60e4e4de615124d5239219f32946d10151d"
      },
      {
        id: "0xa1c9014ab15a5dd5e0bd987f36ce878bb607d730-0x96974f044201851058c726f64b0baa8a1a4eba4a"
      },
      {
        id: "0xa83bfad0771dcb68f40b0c93db3d2f63757f628c-0x7136fbddd4dffa2369a9283b6e90a040318011ca"
      },
      {
        id: "0xacf72f22b47cbdfc39c08de103c34cb802576d38-0xf3d9281fa183b74f32b96e1c5244596045f4ede8"
      },
      {
        id: "0xb92bef11920dab44fd95ff14894accc9cccba096-0xb6dacfc9e6443f2546e9285ba4ae6359cdc20727"
      },
      {
        id: "0xba7f8d7093a928929e7564c6c6e869863fade451-0xd247cf531b9374eb2ba115b68c3b4ebe6c64f5fb"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0x1dac51886d5b461fccc784ad3813a5969dd42e6f"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0x509fdabab2c609dfd1230c3c36e859779ed97fed"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0x5a9e792143bf2708b4765c144451dca54f559a19"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0x5b93ff82faaf241c15997ea3975419dddd8362c5"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0x81aaa9a7a8358cc2971b9b8de72acce6d7862bc8"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0x83ab8e31df35aa3281d630529c6f4bf5ac7f7abf"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0x865c2f85c9fea1c6ac7f53de07554d68cb92ed88"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0x8f942eced007bd3976927b7958b50df126feecb5"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0xa15ca74e65bf72730811abf95163e89ad9b9dff6"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0xb53b0255895c4f9e3a185e484e5b674bccfbc076"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0xbaf6e57a3940898fd21076b139d4ab231dcbbc5f"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0xced608aa29bb92185d9b6340adcbfa263dae075b"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0xd26a3f686d43f2a62ba9eae2ff77e9f516d945b9"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0xd3e9d60e4e4de615124d5239219f32946d10151d"
      },
      {
        id: "0xbd6fa666fbb6fdeb4fc5eb36cdd5c87b069b24c1-0xe0019916722b6dd82db413827a967ccc302a3477"
      },
      {
        id: "0xca09277f288b255fb30fe990253e798f48a43715-0x75e207d0e6984e604bdbec050711b79db5e996d8"
      },
      {
        id: "0xcbab6a09cecd79d20a27e731ec30e9ec7a546abe-0x61ec9b1f9547705227fe4854d4e90356a3d0a286"
      },
      {
        id: "0xd2cf5d07750265706f563351f35940d86b121e30-0x2577a8539cb2194acd72f035dbb691ce5f406d3f"
      },
      {
        id: "0xd32ef859c95d8dd9e673bd150fbf89c648f11a8e-0xa8c47a6a43e9b211e05eb259a9abdb8472971314"
      },
      {
        id: "0xda6f46819152ce84a7e5f975024913320fe0007d-0x8db6b632d743aef641146dc943acb64957155388"
      },
      {
        id: "0xe0e3aaac46e9f1147a1f1c6e0a48979cc2c0df51-0xd26a3f686d43f2a62ba9eae2ff77e9f516d945b9"
      },
      {
        id: "0xe4e9cb9b13cf9abf61c3fcacb14d916a01d3ff29-0xd26a3f686d43f2a62ba9eae2ff77e9f516d945b9"
      },
      {
        id: "0xec9728a48617ea11137d05c4d7a60164c14db672-0x0d97e169bd4f99418cab729ba5a84df44ea44f85"
      },
      {
        id: "0xf3e556b94378c1a1cbb1e4681b8660e04d3d8146-0xf3d9281fa183b74f32b96e1c5244596045f4ede8"
      },
      {
        id: "0xf4ea80eacd51173c33ae154da6f6e852b5133ecc-0xc957fcd9be2dcd01385fdceb2b9f72f921a271ee"
      },
      {
        id: "0xf551b1c3822ba1062599e0f7d7db0a282ec4076b-0xd26a3f686d43f2a62ba9eae2ff77e9f516d945b9"
      },
      {
        id: "0xf556458cd4043b95bf7a0e3f89e9d78febdd5b72-0x52d79dc82a45b8bec3783d352c5cc49b083bd949"
      }
    ]
  }
};

const moloch = {
  data: {
    members: [
      {
        id: "0x0039f22efb07a647557c7c5d17854cfd6d489ef3"
      },
      {
        id: "0x04576eb9aff2be4122d1ba870eea8db4573a97d9"
      },
      {
        id: "0x0a7da1fe01846f96eb44c4c3952a0f5baec148b3"
      },
      {
        id: "0x0a9e871cf80289e592df3c503db3dd8167fbbd07"
      },
      {
        id: "0x0b916095200313900104bacfc288462682c38700"
      },
      {
        id: "0x0f0957c08314205327bbec069307390251fbca91"
      },
      {
        id: "0x1a57f99c4759f4e4e29140b1d7a89584e1c1ef67"
      },
      {
        id: "0x1b037167c4b0584ca5ef6534648c38f496757fa5"
      },
      {
        id: "0x1db3439a222c519ab44bb1144fc28167b4fa6ee6"
      },
      {
        id: "0x1fd1d8b92e17f64513a6da3b44ad3f00218454a9"
      },
      {
        id: "0x23ecac365ca93ef39f7532ee49c93af96bca8fa5"
      },
      {
        id: "0x2525f1a08a2d5f037dda969f2fa1b56e4b4b47f3"
      },
      {
        id: "0x2586e4b30c581ee20af694495dbcf98daecde75e"
      },
      {
        id: "0x2625f1c0bc50b2f663bea454ccb7398fe3e7a9ae"
      },
      {
        id: "0x26885a15e186dc884a193c257ee6f15a90fd8d7a"
      },
      {
        id: "0x2895730bd3725084c91a07f25786baac644851a2"
      },
      {
        id: "0x28ab95385e1a576fe15c70c4850dcdc6b10a5f6d"
      },
      {
        id: "0x29983374cbb8253a114df5f38ec3f171f95bb8c7"
      },
      {
        id: "0x2af4125c8fe208a349ef78d3cb980308ab1ed34f"
      },
      {
        id: "0x2b0f6fd62dcec4e997bb08f20a731cb36a8e3042"
      },
      {
        id: "0x3274e22d86cc21778df15836833e147b1894d3e4"
      },
      {
        id: "0x37385081870ef47e055410fefd582e2a95d2960b"
      },
      {
        id: "0x38d4d579f130b62b3cfa75871cf833f3ef2380f8"
      },
      {
        id: "0x3ec2cd742b0538c7eb68e4d9c943fc68519ca4d5"
      },
      {
        id: "0x422b469a2fbf23b78d994cd20bf813662d1159f5"
      },
      {
        id: "0x44cad9af73c8175009f06fbde856efba453a40e0"
      },
      {
        id: "0x48f15f4873aba373cb544c50919cafa7384a2187"
      },
      {
        id: "0x4d3caed8a1cf048c18280a8320608fc7d59c3ee3"
      },
      {
        id: "0x4f8eeaba7e19fd67673306f2dc9fb809150de173"
      },
      {
        id: "0x50b132becbcf8344b5d902abfb011bfc95a25942"
      },
      {
        id: "0x512e07a093aaa20ba288392eadf03838c7a4e522"
      },
      {
        id: "0x5320ad1a8aa3304064e1c523eb7c41cc38cf1be5"
      },
      {
        id: "0x53daa790311c435a8957c6b4ec1855357923e729"
      },
      {
        id: "0x54bfb3a5e2e5999b9e2fd63def9750ca667adc5b"
      },
      {
        id: "0x59a5493513ba2378ed57ae5ecfb8a027e9d80365"
      },
      {
        id: "0x5a9e792143bf2708b4765c144451dca54f559a19"
      },
      {
        id: "0x5bb3e1774923b75ecb804e2559149bbd2a39a414"
      },
      {
        id: "0x5e682cb9b6dc4b0fd299908672839556485e992b"
      },
      {
        id: "0x60623112855dfed72b48ed472e84d3b12aba0eef"
      },
      {
        id: "0x62df6557e5fbafb4bcdce70b0e3222e7d73a89b6"
      },
      {
        id: "0x66666630b6260170d05365521a9ac2c3702bc0d0"
      },
      {
        id: "0x68085e7f88e90fa9247489c83fab30b177ebccb3"
      },
      {
        id: "0x68429ea70a7a1d196f24be2e7fb05ed94166e9a3"
      },
      {
        id: "0x6b6398c9838d92a779b52f8cf3d91a6586fccb7f"
      },
      {
        id: "0x74d5e6d53fcb220a195bfbdb2ae04607454eb81b"
      },
      {
        id: "0x7a446c7fda67e5e8705ad90f2da52fc018280731"
      },
      {
        id: "0x7b3e509c78faee4c589d3d07ea0c8929aa2835e3"
      },
      {
        id: "0x7f4c4b0f51c17e72248b2bcef176e7649c187e7b"
      },
      {
        id: "0x818ff73a5d881c27a945be944973156c01141232"
      },
      {
        id: "0x865595dbb0099ea9caedbdc35ad2498fd91caca5"
      },
      {
        id: "0x865c2f85c9fea1c6ac7f53de07554d68cb92ed88"
      },
      {
        id: "0x89e12f054526b985188b946063ddc874a62fed45"
      },
      {
        id: "0x8b00191a7a3349ceffe90d2414fe0833fde0368e"
      },
      {
        id: "0x8c0c78e6e81510b96fe34483c05ee203a1f0457b"
      },
      {
        id: "0x8c8a0427059ec0598fca6974d1684ace4b0f376d"
      },
      {
        id: "0x91dbd5e72b1331447a40932bf16d140cf4638324"
      },
      {
        id: "0x965fdb32e3fcdc6dc323464a42a9615e6a5464d1"
      },
      {
        id: "0xa619a7c8f89a6338756a428b710bbcd7a094d140"
      },
      {
        id: "0xa98bb5cedc8ad73583f0783e48a8522d55c666e3"
      },
      {
        id: "0xabbd0c374f54edc4392c9ff45db9b65e91bc2678"
      },
      {
        id: "0xac4361f56c82ed59d533d45129f407015d84702a"
      },
      {
        id: "0xac9ba72fb61aa7c31a95df0a8b6eba6f41ef875e"
      },
      {
        id: "0xae0ed27010f2c4b9fc63ca359290bf5c0f883ad2"
      },
      {
        id: "0xae5fb390e5c4fa1962e39e98dbfb0ed8055ed7a9"
      },
      {
        id: "0xb5064a1ec1b2cb2292e24c8e398c3fc1efe43955"
      },
      {
        id: "0xbaf2d86e1224b5fc9121495fe2b55a273d6f2bae"
      },
      {
        id: "0xbc64bde4c3b70147c47c16dd9277a6aaef7e0f02"
      },
      {
        id: "0xbcede714283f348ebb3e5cbaf8a947cab3c8be8d"
      },
      {
        id: "0xbd9f96663e07a83ff18915c9074d9dc04d8e64c9"
      },
      {
        id: "0xbf42b21338236126d83618cf51570c2ae8ca6d6d"
      },
      {
        id: "0xc746a92f997333841adf686253eb77441d9868f4"
      },
      {
        id: "0xc82a6220398714f74e2d929309f4c5b1d4f7b0f6"
      },
      {
        id: "0xcc04c8eff1c7049f948c12dd5286a56114228657"
      },
      {
        id: "0xcd16cbda54af2556ebb6df4fbfd178e63c33fd89"
      },
      {
        id: "0xd26a3f686d43f2a62ba9eae2ff77e9f516d945b9"
      },
      {
        id: "0xdcf220450fa8dfaef1246a805142b9aa284d412e"
      },
      {
        id: "0xdf95439916bc1a4eabc3df006665dd31b424e174"
      },
      {
        id: "0xe84c0c01d76c169e9c92b6e666b52e4f4b6e5300"
      },
      {
        id: "0xe8e4a1d6bff7a3b8904eedd3feb6e7927736c055"
      },
      {
        id: "0xeb38597267b8b6f9cdfcf6466ad9384e95271efc"
      },
      {
        id: "0xebac3108c58bd4dd48a8110b7750480cea7bc3fb"
      },
      {
        id: "0xecd11858a4bcc35a51084ebe672beace01142fca"
      },
      {
        id: "0xed94c5ca5f764687f8555e32ed191a959bb50fd5"
      },
      {
        id: "0xf754eee52ae08568201c56f51ba985638edae1c4"
      },
      {
        id: "0xfaae12e4166e499666e94da41b174aa669a7d79e"
      },
      {
        id: "0xff5f549ca771e86f3fe5e67d4f528c829add0ad3"
      },
      {
        id: "0xff7040a65dd36b9da95b05ef8e1eeea222f6c5fe"
      }
    ]
  }
};

const yang = {
  data: {
    members: [
      {
        id: "0x082b5e90a32d897297dee6edc659eb034f6fd61e"
      },
      {
        id: "0x0f271de9dd9ef1085a6e622b675c3ef88e945511"
      },
      {
        id: "0x208ac899ef6f2beb4bdc8146ffb228ee02d74fbc"
      },
      {
        id: "0x239498540a9508c0ff9271d2d4ffe88ab73361e3"
      },
      {
        id: "0x2895730bd3725084c91a07f25786baac644851a2"
      },
      {
        id: "0x29c6a26868bab37a1dd8064d3e8cc627475eeec3"
      },
      {
        id: "0x2a52309edf998799c4a8b89324ccad91848c8676"
      },
      {
        id: "0x2c3dd65e94f97b2a25239eddffd2e192c08769b8"
      },
      {
        id: "0x2ef52edbb0acd7944695f1191990529e68baedd6"
      },
      {
        id: "0x309473429460f06b2e17b7cf3bea2bc3e3b9e867"
      },
      {
        id: "0x40d3806b9ef4ac9252c6369ee991e0f6c3522b0e"
      },
      {
        id: "0x44036375848535fbe1730b9f831c6da30250e9f1"
      },
      {
        id: "0x4d3caed8a1cf048c18280a8320608fc7d59c3ee3"
      },
      {
        id: "0x50e5820d77708183ce2d032f00b8cd687a2d505d"
      },
      {
        id: "0x512e07a093aaa20ba288392eadf03838c7a4e522"
      },
      {
        id: "0x574acdddb3879d039e2ff51dbb86d1a67b119ccf"
      },
      {
        id: "0x5ab45a72e977980f1d216aecd09c038ed6baaed5"
      },
      {
        id: "0x6a766c99f66a5b6e310c8dda949f4a79dfd69fd9"
      },
      {
        id: "0x72c53a7d74fda326785da3d9f0a93a14b12efbdf"
      },
      {
        id: "0x839395e20bbb182fa440d08f850e6c7a8f6f0780"
      },
      {
        id: "0x865c2f85c9fea1c6ac7f53de07554d68cb92ed88"
      },
      {
        id: "0x86a8916b263e25cb98061a37eaaefecbba103503"
      },
      {
        id: "0x9d8c0fb2f7870afe203821d00649a0c3a0b0f049"
      },
      {
        id: "0xa1d63219e80e7074197adf5d28630b79b4ce06c4"
      },
      {
        id: "0xa5a932aa902fdf4e8af9fe9529a641854058bb73"
      },
      {
        id: "0xc59e8a0e296c7e21c68e16887d0ffc7cf1babc6b"
      },
      {
        id: "0xcff1ccb95dac9ed781c4d39de9e2ffd86837f5ad"
      },
      {
        id: "0xd26a3f686d43f2a62ba9eae2ff77e9f516d945b9"
      },
      {
        id: "0xdb87eb2cbea0983517ae0fd8ded24769855868ca"
      },
      {
        id: "0xddc674c29f2b34fc2338b719c0ae711b063eeadb"
      },
      {
        id: "0xee0b41def557f3c187925e0403a86499af650317"
      },
      {
        id: "0xf11b1c3b557ba973360c418330dedfe054e7ae91"
      },
      {
        id: "0xf5dcd98a1c99c2c65c62025cb23cfb6f12f35497"
      }
    ]
  }
};

const metacartel = {
  data: {
    members: [
      {
        id: "0x007bc558d547ada9813bf148510988262f510c4e"
      },
      {
        id: "0x0492b9170ec01d91f3aa721ff8ada42dd33fbbb8"
      },
      {
        id: "0x0aba55c93cf7292f71067b0ba0d8b464592895ca"
      },
      {
        id: "0x0eabffd8ce94ab2387fc44ba32642af0c58af433"
      },
      {
        id: "0x1289f94bcc60ed9f894ab9d5a54c21b3d4b3f2da"
      },
      {
        id: "0x1c9e5aba9bce815ed3bb7d9455931b84c56d5114"
      },
      {
        id: "0x2566190503393b80bded55228c61a175f40e4d42"
      },
      {
        id: "0x370ceca4fc1287ed99924bba76259f6c771a6022"
      },
      {
        id: "0x3d1df1a816577a62db61281f673c4f43ae063490"
      },
      {
        id: "0x3d97da320ed3d3aee33559b643339571a8abe6e9"
      },
      {
        id: "0x4444444477eb5fe6d1d42e98e97d9c4c03a57f99"
      },
      {
        id: "0x476547d8472407cb05acc4b3b8a5431871d0d072"
      },
      {
        id: "0x59e4415cc1eccecb5edaec533bdd87bf47c2ecf9"
      },
      {
        id: "0x5b93ff82faaf241c15997ea3975419dddd8362c5"
      },
      {
        id: "0x5bb3e1774923b75ecb804e2559149bbd2a39a414"
      },
      {
        id: "0x5bfd96e1a7d2f597cc1a602d89fc9fca61207e09"
      },
      {
        id: "0x5f350bf5fee8e254d6077f8661e9c7b83a30364e"
      },
      {
        id: "0x632889068e25630f5c928681e8529ee255d8cd52"
      },
      {
        id: "0x66268791b55e1f5fa585d990326519f101407257"
      },
      {
        id: "0x6dc43be93a8b5fd37dc16f24872babc6da5e5e3e"
      },
      {
        id: "0x7a446c7fda67e5e8705ad90f2da52fc018280731"
      },
      {
        id: "0x7f4c4b0f51c17e72248b2bcef176e7649c187e7b"
      },
      {
        id: "0x818ff73a5d881c27a945be944973156c01141232"
      },
      {
        id: "0x82a8439ba037f88bc73c4ccf55292e158a67f125"
      },
      {
        id: "0x839395e20bbb182fa440d08f850e6c7a8f6f0780"
      },
      {
        id: "0x83ab8e31df35aa3281d630529c6f4bf5ac7f7abf"
      },
      {
        id: "0x865c2f85c9fea1c6ac7f53de07554d68cb92ed88"
      },
      {
        id: "0x882651817bc443fabc95c7cc9124367082470d66"
      },
      {
        id: "0x8b3765eda5207fb21690874b722ae276b96260e0"
      },
      {
        id: "0x8c4c44fd06f7f98f08bf6a9ca156cec9ee1f31f8"
      },
      {
        id: "0x91c9bc455aadb2d6419be6b42ae08e1dc2b406bb"
      },
      {
        id: "0x93f3f612a525a59523e91cc5552f718df9fc0746"
      },
      {
        id: "0x9492510bbcb93b6992d8b7bb67888558e12dcac4"
      },
      {
        id: "0xa153b8891e77f1ae037026514c927530d877fab8"
      },
      {
        id: "0xa15ca74e65bf72730811abf95163e89ad9b9dff6"
      },
      {
        id: "0xa84944735b66e957fe385567dcc85975022fe68a"
      },
      {
        id: "0xa8bf16be6829d8eb167b62e11517cd01623d7ec6"
      },
      {
        id: "0xafd5f60aa8eb4f488eaa0ef98c1c5b0645d9a0a0"
      },
      {
        id: "0xb53b0255895c4f9e3a185e484e5b674bccfbc076"
      },
      {
        id: "0xb98ec0012fba5de02ab506782862a63a7945ee9c"
      },
      {
        id: "0xbaf6e57a3940898fd21076b139d4ab231dcbbc5f"
      },
      {
        id: "0xbfa663d95f32ab88d01de891e9bde0f8ba8662ec"
      },
      {
        id: "0xc6b0a4c5ba85d082ecd4fb05fbf63eb92ac1083a"
      },
      {
        id: "0xc9283bbd79b016230838e57ce19e6aca12dd2c0d"
      },
      {
        id: "0xcd16cbda54af2556ebb6df4fbfd178e63c33fd89"
      },
      {
        id: "0xd26a3f686d43f2a62ba9eae2ff77e9f516d945b9"
      },
      {
        id: "0xd3e9d60e4e4de615124d5239219f32946d10151d"
      },
      {
        id: "0xd6e371526cdaee04cd8af225d42e37bc14688d9e"
      },
      {
        id: "0xdff1a9df8f152181614c5bfe930b841487228fa3"
      },
      {
        id: "0xe04885c3f1419c6e8495c33bdcf5f8387cd88846"
      },
      {
        id: "0xe16df3b67c0f85da576bd4080f08e8ecad2a17f2"
      },
      {
        id: "0xe50c27dd2c9bbc80a3c1f396f25252b663382905"
      },
      {
        id: "0xe5cd62ac8d2ca2a62a04958f07dd239c1ffe1a9e"
      },
      {
        id: "0xea9e8bd43c6bf63981d95e4aeb1deb8405fb3efe"
      },
      {
        id: "0xf6f4bbf25a1e596df0d77179dd65cf6f78cb7377"
      },
      {
        id: "0xf754eee52ae08568201c56f51ba985638edae1c4"
      },
      {
        id: "0xf7f189082878846c11a94ddac51c41afc7a7c772"
      },
      {
        id: "0xfab3b4be0a78c586cdb999258ddd7dc799d433d2"
      },
      {
        id: "0xffc380fd196440e53ab0ad9f4504aa3e7f3c9b97"
      },
      {
        id: "0xffd1ac3e8818adcbe5c597ea076e8d3210b45df5"
      }
    ]
  }
};

const orochi = {
  data: {
    members: [
      {
        id: "0x0efe994201e2b0136dd40d5033b5f437e4c5f958"
      },
      {
        id: "0x1b037167c4b0584ca5ef6534648c38f496757fa5"
      },
      {
        id: "0x2a5a66f72e11a497c4e7dfeebb5bf8535b77076c"
      },
      {
        id: "0x31b4c292b4639a32a0aca72b0451499b464c58cb"
      },
      {
        id: "0x3a44eb3f751ec2f737f9f9b0b11b5984e8f3d712"
      },
      {
        id: "0x3d51cc44f6913acab92d4d4537eafce72589b8ac"
      },
      {
        id: "0x614a61a3b7f2fd8750acaad63b2a0cfe8b8524f1"
      },
      {
        id: "0x6dc43be93a8b5fd37dc16f24872babc6da5e5e3e"
      },
      {
        id: "0x8b4e42b43ed7b62ec1e3fc4e6548a8ab989302b6"
      },
      {
        id: "0x8c584dc20a725870c12c9cfef4eff4f66ec638d3"
      },
      {
        id: "0xbaf6e57a3940898fd21076b139d4ab231dcbbc5f"
      },
      {
        id: "0xcd16cbda54af2556ebb6df4fbfd178e63c33fd89"
      },
      {
        id: "0xe25ff6945ebe76c1d12b5b260067f1164a6cf1a5"
      },
      {
        id: "0xea68f99ac001e506551ab78c84bba95f66507743"
      },
      {
        id: "0xfc3cc62e17ab67cda146ee6b4a44659e5354a7a6"
      },
      {
        id: "0xfd7203d5096f537246333c8d65a7707f46f8d9cc"
      },
      {
        id: "0xffd1ac3e8818adcbe5c597ea076e8d3210b45df5"
      }
    ]
  }
};

const daosaka = {
  data: {
    members: [
      {
        id: "0x04794b2e458b1bf5bc3cd6d821e0dfb5c010f36f"
      },
      {
        id: "0x0f48669b1681d41357eac232f516b77d0c10f0f1"
      },
      {
        id: "0x2de14db256db2597fe3c8eed46ef5b20ba390823"
      },
      {
        id: "0x3768225622d53ffcc1e00eac53a2a870ecd825c8"
      },
      {
        id: "0x401cbf2194d35d078c0bcdae4bea42275483ab5f"
      },
      {
        id: "0x4b6f3290f9fd69bf05b203a35fbe60189b060de8"
      },
      {
        id: "0x54becc7560a7be76d72ed76a1f5fee6c5a2a7ab6"
      },
      {
        id: "0x5b0d92e138422428d8e5afab8ee8f99ba9a4e613"
      },
      {
        id: "0x686f6f69c4cfa632cfe7a80c4f734759033beee1"
      },
      {
        id: "0x77350e1152efd5f2d807a6124015c629a907155e"
      },
      {
        id: "0x7dec37c03ea5ca2c47ad2509be6abaf8c63cdb39"
      },
      {
        id: "0x865c2f85c9fea1c6ac7f53de07554d68cb92ed88"
      },
      {
        id: "0x8b104344f397afc33ee55c743a0fbd7d956201cd"
      },
      {
        id: "0x8b7adc43153bcfae98ab20ce9fff23331f542387"
      },
      {
        id: "0x92b9a4b57b4a68db7d26b7b83bf98beeda69d440"
      },
      {
        id: "0x9a3e204bd2f012122b228fa68bf97539da965d3b"
      },
      {
        id: "0x9af481276b075e036bc23e887a8bd275e69ef74c"
      },
      {
        id: "0x9bcb319bed50ff0ce2d6ffa95ab9293a175aed7d"
      },
      {
        id: "0xa0ca69a35c77ab43f39e3439539a098a948552c6"
      },
      {
        id: "0xa12db9f88f096f527fbe87a752c6ec16d501a25f"
      },
      {
        id: "0xac50a25a798795bd3a81d937db3dc7681ac600bf"
      },
      {
        id: "0xb7f73311a823fa70059cf6e22a842c3bd64c53c3"
      },
      {
        id: "0xc2f82a1f287b5b5aebff7c19e83e0a16cf3bd041"
      },
      {
        id: "0xd26a3f686d43f2a62ba9eae2ff77e9f516d945b9"
      },
      {
        id: "0xe13d4abee4b304b67c52a56871141cad1b833aa7"
      },
      {
        id: "0xe1a3435b683d863bcb6c8aa093de08ed0557ee99"
      },
      {
        id: "0xe2d128323cf7560a6e7a82726d7b425aedc7a556"
      },
      {
        id: "0xebf96b95e2d08651856ff82771876338ac289f06"
      },
      {
        id: "0xed9b15ba4d0e3d8bb1825f1b994eb6406d8b3a92"
      },
      {
        id: "0xfba2c2bbf977eda19ad819bb46787f4c91d1ffad"
      }
    ]
  }
};

const raid = {
  data: {
    members: [
      {
        id: "0x1dac51886d5b461fccc784ad3813a5969dd42e6f"
      },
      {
        id: "0x509fdabab2c609dfd1230c3c36e859779ed97fed"
      },
      {
        id: "0x5a9e792143bf2708b4765c144451dca54f559a19"
      },
      {
        id: "0x5b93ff82faaf241c15997ea3975419dddd8362c5"
      },
      {
        id: "0x81aaa9a7a8358cc2971b9b8de72acce6d7862bc8"
      },
      {
        id: "0x83ab8e31df35aa3281d630529c6f4bf5ac7f7abf"
      },
      {
        id: "0x865c2f85c9fea1c6ac7f53de07554d68cb92ed88"
      },
      {
        id: "0x8f942eced007bd3976927b7958b50df126feecb5"
      },
      {
        id: "0xa15ca74e65bf72730811abf95163e89ad9b9dff6"
      },
      {
        id: "0xb53b0255895c4f9e3a185e484e5b674bccfbc076"
      },
      {
        id: "0xbaf6e57a3940898fd21076b139d4ab231dcbbc5f"
      },
      {
        id: "0xced608aa29bb92185d9b6340adcbfa263dae075b"
      },
      {
        id: "0xd26a3f686d43f2a62ba9eae2ff77e9f516d945b9"
      },
      {
        id: "0xd3e9d60e4e4de615124d5239219f32946d10151d"
      },
      {
        id: "0xe0019916722b6dd82db413827a967ccc302a3477"
      }
    ]
  }
};

const trojan = {
  data: {
    members: [
      {
        id: "0x30043aabbcebbd887437ec4f0cfe6d4c0eb5cc64"
      },
      {
        id: "0x4fafa767c9cb71394875c139d43aee7799748908"
      },
      {
        id: "0x5a9e792143bf2708b4765c144451dca54f559a19"
      },
      {
        id: "0x5c930db102c6ebb9cc32fd26f8a274f9493c5c52"
      },
      {
        id: "0x839395e20bbb182fa440d08f850e6c7a8f6f0780"
      },
      {
        id: "0x865c2f85c9fea1c6ac7f53de07554d68cb92ed88"
      },
      {
        id: "0x86fd6dd41bad636b5b3b9228bc5642fa0df392e8"
      },
      {
        id: "0x91e6a34a129016e8b72b82d8aa31d69420ef9931"
      },
      {
        id: "0xd41db68fc5857f62e15e812653280eca3bfa0339"
      }
    ]
  }
};

const meme = {
  data: {
    members: [
      {
        id: "0x067f2bef6a1f929544253b9fb95f99bae77b2518"
      },
      {
        id: "0x0998160bdf3ff6d86a4e9d5c31e0efc3ca7e7d01"
      },
      {
        id: "0x12909009d651d40d6ae00b150db3107bc5654603"
      },
      {
        id: "0x3d19777f46c739c6fd921e0fe3ebc65de003a353"
      },
      {
        id: "0x934b510d4c9103e6a87aef13b816fb080286d649"
      }
    ]
  }
};

const james = {
  "data": {
    "members": [
      {
        "id": "0x11e4857bb9993a50c685a79afad4e6f65d518dda"
      },
      {
        "id": "0x5bb3e1774923b75ecb804e2559149bbd2a39a414"
      },
      {
        "id": "0x6a0f084c85e9edf366dfdfa1df8fa8fd99b5d7e2"
      },
      {
        "id": "0x84843b49657da7d9084fb577214090fc7bf3c53a"
      },
      {
        "id": "0x865c2f85c9fea1c6ac7f53de07554d68cb92ed88"
      },
      {
        "id": "0xbaf6e57a3940898fd21076b139d4ab231dcbbc5f"
      },
      {
        "id": "0xcb5fba4419abc4d7c11af0c24ba0f2e555407f5b"
      }
    ]
  }
}

class Filling {
  storage = new Map<string, Set<string>>();
  constructor() {}

  has(k: string) {
    return this.storage.has(k.toLowerCase());
  }

  get(k: string) {
    const t = this.storage.get(k.toLowerCase());
    return t ? t : new Set<string>();
  }

  add(k: string, v: string) {
    const found = this.get(k);
    this.storage.set(k.toLowerCase(), found.add(v.toLowerCase()));
  }

  toJSON() {
    let r = {daos: [], mean: 0} as {daos: {account: string, daos: string[]}[], mean: number}
    this.storage.forEach((v, k) => {
      r.daos.push({
        account: k,
        daos: Array.from(v)
      })
    })
    let daosPerPerson = r.daos.map(v => v.daos.length)
    r.mean = _.mean(daosPerPerson)
    return r
  }
}

const participation = new Filling()

daohaus.data.members.forEach(m => {
  const [dao, account] = m.id.split('-')
  participation.add(account, dao)
})

moloch.data.members.forEach(m => {
  participation.add(m.id, '0x1fd169A4f5c59ACf79d0Fd5d91D1201EF1Bce9f1')
})

yang.data.members.forEach(m => {
  participation.add(m.id, '0xB3C02F093E6140Ed2ad91Be66B302F938cd8434f')
})

metacartel.data.members.forEach(m => {
  participation.add(m.id, '0x0372f3696fA7dC99801F435FD6737E57818239F2')
})

orochi.data.members.forEach(m => {
  participation.add(m.id, '0x8487dcC6f4b28b911e22A8657eBB16427d4Cf5c0')
})

daosaka.data.members.forEach(m => {
  participation.add(m.id, '0x7D1a4fC6Df3B16eB894004A4586A29f39Ba6d205')
})

raid.data.members.forEach(m => {
  participation.add(m.id, '0xbd6Fa666FbB6fdEB4Fc5eB36CdD5c87B069B24C1')
})

trojan.data.members.forEach(m => {
  participation.add(m.id, '0xcC7dcdB700eeD457C8180406D7D699877F4EEE24')
})

meme.data.members.forEach(m => {
  participation.add(m.id, '0xA49378Ff39518F2A6fdCcDB5cE7d63711a3FaF99')
})

james.data.members.forEach(m => {
  participation.add(m.id, '0x77b53AD9d111029D1F16F4f19769846384bDa49b')
})

const a = new Filling()
participation.storage.forEach((v, k) => {
  if (v.size > 1) {
    v.forEach(vv => {
      a.add(k, vv)
    })
  }
})

let max = 0
let addrMax = ''
participation.storage.forEach((v, k) => {
  if (v.size > max) {
    max = v.size
    addrMax = k
  }
})

console.log(addrMax, max)

// console.log(a.toJSON())
//
// console.log(JSON.stringify(participation.toJSON(), null, 4));

//
// const participation = a.data.members.map(m => m.id.split("-"));
// const p = new Map<string, number>();
// for (let pp of participation) {
//   const found = p.get(pp[0]) || 0
//   p.set(pp[0], found + 1)
// }
//
// console.log(Array.from(p))
