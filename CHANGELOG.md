### Changelog

#### [v0.1.2](https://github.com/eCollect/node-ebics-client/compare/v0.1.1...v0.1.2)

> 7 November 2019

- chore: add changelog configuration [`#22`](https://github.com/eCollect/node-ebics-client/pull/22)
- Closes #17 and #13  [`#21`](https://github.com/eCollect/node-ebics-client/pull/21)
- Drop moment dependency [`#20`](https://github.com/eCollect/node-ebics-client/pull/20)

- feat: add nyc and cleanup .gitignore [`3e95478`](https://github.com/eCollect/node-ebics-client/commit/3e95478b3be719c86f32c7df10c42e46b7518669)
- feat: drop bn.js [`eea0a49`](https://github.com/eCollect/node-ebics-client/commit/eea0a49130e30c123b110120c69d7b7c19fd12ba)
- add changelog configuration [`1f34dcb`](https://github.com/eCollect/node-ebics-client/commit/1f34dcbfb6e0febbb93d5356fa36ac57d697a990)

#### [v0.1.1](https://github.com/eCollect/node-ebics-client/compare/v0.1.0...v0.1.1)

> 5 November 2019

- chore: update license [`9aabe93`](https://github.com/eCollect/node-ebics-client/commit/9aabe933e91b506ea38820b952ce8e5e58b4c2ff)

#### [v0.1.0](https://github.com/eCollect/node-ebics-client/compare/v0.0.8...v0.1.0)

> 5 November 2019

- Feat: handle unsual exponent migrate to node-forge [`#16`](https://github.com/eCollect/node-ebics-client/pull/16)
- Add order generation tests and fix linting [`#15`](https://github.com/eCollect/node-ebics-client/pull/15)
- test script run mocha [`#14`](https://github.com/eCollect/node-ebics-client/pull/14)

- feat: prepare order generation tests [`e40f79c`](https://github.com/eCollect/node-ebics-client/commit/e40f79cee68a194272c93f07e763175b213a77a1)
- chore: cleanup [`0c01420`](https://github.com/eCollect/node-ebics-client/commit/0c01420c1e14992a4169098ccd47cd196b899f06)

#### [v0.0.36](https://github.com/eCollect/node-ebics-client/compare/v0.0.35...v0.0.36)

> 1 June 2018

- various modular fixes [`8492d94`](https://github.com/eCollect/node-ebics-client/commit/8492d940542f61b17aa3a2da7de23f6539ffaad5)

#### [v0.0.35](https://github.com/eCollect/node-ebics-client/compare/v0.0.3...v0.0.35)

> 31 May 2018

- update License to GPL v3 [`babcf76`](https://github.com/eCollect/node-ebics-client/commit/babcf76b61af6eb737ab291a301e71bb84621820)
- Add MGF1.js file - mask generation utility class [`7e6e2ff`](https://github.com/eCollect/node-ebics-client/commit/7e6e2ff142688b0c453369fa7137b49e8b89cd81)
- Add sign, _emsaPSS and _modPowe methods in Key.js file [`5ace213`](https://github.com/eCollect/node-ebics-client/commit/5ace2137231af9a3563ab31fa0f70fbdf4b148cb)

#### [v0.0.8](https://github.com/eCollect/node-ebics-client/compare/v0.0.7...v0.0.8)

> 8 October 2019

- chore: readme maintenance [`#11`](https://github.com/eCollect/node-ebics-client/pull/11)
- Provide examples [`#10`](https://github.com/eCollect/node-ebics-client/pull/10)

- initialize.js [`7dad7c8`](https://github.com/eCollect/node-ebics-client/commit/7dad7c878722be94e03808cef3af38d34019c623)
- examples/bankLetter.js [`ce6e58b`](https://github.com/eCollect/node-ebics-client/commit/ce6e58b3f33017967e5b26fe15a2c435012b8af6)
- examples/send-hbt-order.js [`166c61a`](https://github.com/eCollect/node-ebics-client/commit/166c61aec4a247d923de82278271ec02cbef815f)

#### [v0.0.7](https://github.com/eCollect/node-ebics-client/compare/v0.0.6...v0.0.7)

> 2 August 2019

- * Add Z53 order type [`#7`](https://github.com/eCollect/node-ebics-client/pull/7)
- remove eCollect from constant and minor verbose error handling [`#2`](https://github.com/eCollect/node-ebics-client/pull/2)
- add iso pain format XCT order type [`#1`](https://github.com/eCollect/node-ebics-client/pull/1)

- add new order type XZ53 and removed repeated dateRange to consts [`5ff3147`](https://github.com/eCollect/node-ebics-client/commit/5ff314712443c4c8465f46292b010cfedfed8c2e)
- move dateRange from constants to utils [`aa761cf`](https://github.com/eCollect/node-ebics-client/commit/aa761cf7ad87a271d6e6d9eed40e04eb4376f6c5)
- bump version [`79f17e1`](https://github.com/eCollect/node-ebics-client/commit/79f17e14045d121c9505eb3118967f5f88ae79e2)

#### [v0.0.6](https://github.com/eCollect/node-ebics-client/compare/v0.0.5...v0.0.6)

> 24 July 2019

- remove eCollect from constant and minor verbose error handling [`#4`](https://github.com/eCollect/node-ebics-client/pull/4)
- add iso pain format XCT order type [`#5`](https://github.com/eCollect/node-ebics-client/pull/5)

- remove eCollect from constant and minor verbose error handling [`cb2062a`](https://github.com/eCollect/node-ebics-client/commit/cb2062ae2fbd8e8881de26561efddad1f272e065)
- bump [`c9f52d3`](https://github.com/eCollect/node-ebics-client/commit/c9f52d3bd99b9f8761652365b217d9580fa34632)

#### [v0.0.5](https://github.com/eCollect/node-ebics-client/compare/v0.0.4...v0.0.5)

> 28 June 2019

- Fix parsing of the bank keys in the HPB response [`#3`](https://github.com/eCollect/node-ebics-client/pull/3)

- tc for bank keys parsing error [`c571ef1`](https://github.com/eCollect/node-ebics-client/commit/c571ef181bca2e0cbec70bc6df53c706acd6c829)
- #2 corrected bank keys parsing [`5f0b6cd`](https://github.com/eCollect/node-ebics-client/commit/5f0b6cd3747c4613920d2f71f3c04ce13225d397)

#### [v0.0.4](https://github.com/eCollect/node-ebics-client/compare/v0.0.36...v0.0.4)

> 3 September 2018

- Major changes. Separating responsibilities. Orders builder, serializer. [`ff9a3a1`](https://github.com/eCollect/node-ebics-client/commit/ff9a3a16b47d0a25674134c875bfd651995837e4)
- code optimization [`1876360`](https://github.com/eCollect/node-ebics-client/commit/187636019c290d757aca77d4c14fb4f2519acd38)
- client and order optimization [`9454992`](https://github.com/eCollect/node-ebics-client/commit/945499290a8698aed504b573019de2c23148006a)

#### v0.0.3

> 17 May 2018

- initial commit [`1f947ff`](https://github.com/eCollect/node-ebics-client/commit/1f947ff1480c522f89fa1f547581b55e2378d920)
- Initial commit [`cd37de3`](https://github.com/eCollect/node-ebics-client/commit/cd37de3895e32a61798c79ce3a6447e2f269019d)
