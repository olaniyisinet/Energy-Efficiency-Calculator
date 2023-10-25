(function () {
	'use strict';

	angular
		.module('cloudheatengineer')
		.value('heatLossEstimatorReport', {
			// header: function() {
			// 	return {
			// 		columns: [
			// 			{
			// 				width: '*',
			// 				stack: [
			// 					{image:'data:image/png;base64,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', width: 150},
			// 					{text: 'Heat Engineer Software Ltd', style: 'smallGray'}
			// 				]
			// 			},
			// 			{
			// 				width: '*',
			// 				text: ''
			// 			}
			// 		],
			// 		margin: [40, 10, 40, 0]
			// 	};
			// },
			// footer: function(page, pages) {
			// 	return {
			// 		columns: [
			// 			{
			// 				width: 30,
			// 				text: ''
			// 			},
			// 			{
			// 				width: '*',
			// 				alignment: 'center',
			// 				text: [
			// 					{text: 'Survey reference: ', bold: true},
			// 					{text: 'SWEET COTTAGE 2015-12-12 15:10:18 (ASHP)\n'},
			// 					'www.Heat-Engineer.com'
			// 				],
			// 				fontSize: 8
			// 			},
			// 			{
			// 				width: 30,
			// 				alignment: 'right',
			// 				text: [
			// 					{ text: page.toString(), italics: true },
			// 					' of ',
			// 					{ text: pages.toString(), italics: true }
			// 				],
			// 				fontSize: 8
			// 			}
			// 		],
			// 		margin: [40, 0]
			// 	};
			// },
			// pageMargins: [40, 100, 40, 60],
			// content: [
			// 	// PAGE 1
			// 	{ // 0
			// 		stack: [
			// 			'', // 0
			// 			{text: 'Heat Loss Report', alignment: 'center', fontSize: 22, bold: true}, // 1
			// 			{
			// 				text: [
			// 					{text: 'Project Reference: ', bold: true, alignment: 'center'},
			// 					{text: ' '}
			// 				],
			// 				margin: [0, 20, 0, 0],
			// 				fontSize: 16
			// 			}, // 2
			// 			{
			// 				text: [
			// 					{text: 'Heating Type: ', bold: true, alignment: 'center'},
			// 					{text: ' '}
			// 				],
			// 				margin: [0, 20, 0, 0],
			// 				fontSize: 16
			// 			}, // 3
			// 			{text: 'Installation Address', alignment: 'center', bold: true, margin: [0, 20, 0, 0]}, // 4
			// 			{text: 'Title & Name', alignment: 'center', margin: [0, 15, 0, 0]}, // 5
			// 			{text: 'Address Line 1', alignment: 'center', margin: [0, 15, 0, 0]}, // 6
			// 			{text: 'Address Line 2', alignment: 'center', margin: [0, 15, 0, 0]}, // 7
			// 			{text: 'Address Line 3', alignment: 'center', margin: [0, 15, 0, 0]}, // 8
			// 			{text: 'Post Code', alignment: 'center', margin: [0, 15, 0, 0]}, // 9
			// 			{text: 'This report has been completed by company name, address and telephone number', margin: [0, 50, 0, 0]}, // 10
			// 			{image:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQYAAAAoCAYAAAAc5FTOAAAAAXNSR0IArs4c6QAAAAlwSFlzAAAXEgAAFxIBZ5/SUgAAGHlJREFUeAHtXQmYVNWVPrX1vkGzNDuIyiIqiBsaJLKIOmCiYlyiiWYSx2UWnWjGScYxE6MziaNfVmOSL5BonMmXmGAUXEGiE0RcUQREdkH2pZvea53/v9Wv6r1X91XVq66iC+ijTb3l3HP3c889y32eGEB6obcFelugtwVMLeA1Xfde9rZAbwv0toBqAb/RDtFgm8RC7cat9tfjLxFvabV6lxW+D/hlcXwminY2Sywc1NLO9NBjo2XgRztbQLPTuM3q11tSKZ5AmRU3FpVIe5MIfvMDHlV3jy+Qkdyh1jYJhSPiyYhpRaCoV1lWKpWlJepFZygsTW3tKXQMkbCuskJK/D4LkdbOoLR2dGrTeDwe6YM0fl/m9ePTg42ydvsu2bR7v7SAXgz/VaBcI/rXyylDG2RIfZ+UvC0F6bppD4akub0jpTwGLutSGvBLbUW58Ugy1aFvVYX4vNY6MA/mZW9z0iduH6Txov4Eo115bcfnMyfQ0WpsbZdgOOyKDumTFtuzCv1NCEeiwnFDgd+pTEzDPmT/efBfGdqtrCTzeCT9BGM4tPyXcnD5z8Xjt00YYgE4+arGz5ZBVzyi7uP4vwB+vKDqoekf4leOmSGDr/pR4ume574jLWuec0yTQLRdkJlUjpluoWWg7Fn079Ky7sWsacbCHdJ36m1SP+3vDRLqN9LeKNsXXCvhpt0iXuvksSBmc8PdGQbX4Gt/LhXDz0ybIhyJyDWPzJfXP9ooAX+iO9KmMV6GQiH51lV/I/dcfpF6tOid1XLTTx7HQEgtfwhM49vXzpWvz51hJFe/P33+Vbn/94skELAOmCjqUI1BuOhbt8vpI4ZY0hg3LPufVq6SXy97Q1Zu2CqHMdnCmGwS7WKuGJQ+DEQO6AnDBsm8KWfIDdPOkf41VQaJlN8nXlspX5//FMqjbwvW+bJzJsqT/3RTIu2Pn/uLPPCHxSl1IEIUZZl/+5fkinMnJvB5cc9vn5bHl61IScMJN6J/X1n2nTulX3WlSsN2/cpPn0CXcoJlDxHkPQwMkbRYZw4L9s+SD9bl1Nd3fX623PeFS1UB1n26Sy6+/yeKKRoMTFcyMjm2vw99UY8yDKytlgH4GwdmfcW5k2T0wH66ZEnGEIt0qhXdE0HHaoATPRbqSLxJ4uslADs+EzI9pQZPRJ8mQdx2Qcagk2ZioBM69IlEg61Z02S5gvs32XJg4WIoW5sqX34YAyZnNJKaj+ZJa2entGBS+VwyhggmYScmigEhDGquhD4NY4iAMTzz1gfyD5dMw8qdnHRMr/KGxGIGMgauRtEo151U2LbvoNyx4A/y9Mr3FSPwYSJzVQrYViROhjZIJSvWb5YVazfJYy/9n3wXDOoL501OJYonwVCkqzzJMpoRIyhvO+iZwakOxGEbPfPW+ymMoT0YlJY2tFWJtd4RtiElHha8C9iuZHq5MAY7LbZFrn3dYepr9gvLRGkpHWNgFQ62tKqabNl7AOMcTJt9Ckbx0NMvyzc+f5HcMWd6ilRoan3wQg/ELf7pQL0z80u3+CCKwqTNQ5cvn6XkHUeMdrRIpO1gfIV3KredptcvocbtEgMDTBHzcy2fPQ8KftmWh9VT+WLrwV8XEAG+StuVhql5r6WDibtqy3ZZs32nTBo1PJFLury1dJCSW4ZrHvmVrAa9AFYjCN8JevYLVTUwDC+ZEf7fsHOvfPEHC2Tznv3yLxiU5vIzrWoCpzrgvb3O8TQcV/p6R5Hva+s2yt6mZrVSEp/gVO+ohg7blW3BPzc9FNPRwjOnsqqCOfyjq7dRJqd+SpBinoD4jjDZVwfAMO7+zR+lqb1d7r9mbgKdFw5cwIJTtDfhtgPQCzSinV1UA7jh5n0SRbrjCTh4DmN/+9L7H3Wr2gdb2uQrj/5WVm81mII7cgHoOLga/9uTz8hvXl3pLnEO2D7Mhk8g3az4eHMOqY/tJNxm+NAf//3nJfLK6vWWyrqYUZZ0RXETadmPbURb1zKTXZG4UlDJGG6FWHW8ARaO599bq5RfuVb9V0uXy8qPNmHLEFd46uhQDxCCiBuCDkIHFMkjEGkf/OMLsv9wiw4lb8+4VkawTVr8zod5o3m0EOJmiEpt6oKcgAtGR0eH/HLJcqXgNPCOEsaQ3O8ZBedv+PDuLitHXFQyv3O8RkPEwEzCh/c4ohTrC7aC+c9tOal7eG8ztxO73CZV+Bxki99Zk5ER33HZTPnd3TfL+WNHS8RhUPoh4m/atU/+svbjnMriJpEHq+LS1R+r7YSbdG5xzX1jvnZLh/jm9Lx2C0xTgv4++6SRMmbwQIk46IpI14O+eHPDFjDp5kQ2xckYMHm5D0v+sZipkz/UuCOuTElUx36ha1IwBigtgwe32pFxb86z61qDpX1kKa/LtFqC1oesvXlPyWtKP3yeLcS3E63y0qp12Sax4O1vbpFt+w5AN6MfNtToj4R58j+uniNXnz9Z/vHSz1pWITMxljsKs93KDdvMjwtyTY38NijelkPSKSTY+8e4d5tnPvqa1ph6WFUWffM2ef0/75ZbZ0+F9BDWFoXl3NPUItsPJLfXUAcVD3DC1kycJ/VTb7EWCvPbWxo3HZlfhJt2mm+t1zA5emFKpcVCy1QObbfg+8rrZNiXH4fS1tp4h1Y+Lo1vPo7JoBedqcSsGHWuDJxzv4Ue8/TXDrI9y+2WmvKHb7xSLp50ioUA9+rpTH8WZOMGg+D599bInXOnW6wTxut0vweaW6URtnNONB2wPH0xGEupaAQ01NWoPGi2sysZFQK2FBt37aVBSK0B6lkB/mHeYWxvaHa8HKbOfANF9cmjR8Aser0EfOYpFcO9T03QbPMkrQeu+1xKOdm2/dKYeXX0uSxyO8cxcsMFZ8uCV17HNhL+Mrb+Y2/St2IfmIMB5loYz3ruF5X3VcARpt/ozGUAbojbAVsl4wlj4g2US6B2sHTsXgcDQVITq94jTajxU2sewAn0HWF9hjtfZT2kEjaxA+AdmVZWZXYgkekxcx/Wr4+MHTIwE2rG99xOrNq6A5aF3TJx1NCM+GYEOufQKUjf5sBEW9DZynCIov28BNYQmui0rAT9sOtQk3RiUNL5ppDgQb1fXbsRg79Z+sOOn0/gpI37agxOmXRu8yGtIfV1eelrc950jCqDXqgznOoAx/4k8z7cDn1dF+hlQuNtT/xm6XlISSDcvBcl1FQBlfSW12KynuCw1YBl4vAuSBPpPT1V9bMpDzqz0MCOywdQbGyCmerFVWtdk1MOTBnKUUIvO+RBoL+EH1KBExDP8EB0wsnXczKrrXuwnVhfmO0EJ7STstVtHfLV1+Z8sxmhZjWEc6+ZqRbhdaSjWfkweDQDj+64vvI+EqjTr4hKtARTibQdKsKaHYkieeQFbCc4mI1JnE2uXNmZJh2Y35qvndIYjlRO7/P5PBIJx5WniqhWhslndkcVLbZGwDSXXDIGU2N2rQo9VfsoHJsYJ8G9fArA4zBQM1D8NQ369/BliHYclkjrvpSkx8MD2q7fgx/CejgbGWJ/NvXWtHTaZGQMXP2c/mJ419YZSmtOS5uBy5fcUr66ZoPyBPR53dbGZWZFhk4PSXpOamsNZs8tZl1VUo/nYmNHbX4nJlPc/q/8B/TZdKtJPBbljTOpUNdWQCcxMJW/eoD4qvpDv0DexyFqahIwtSjcs2nulCGnE73oocwWy9CdAqvtRHO7vPz+2pTgou7QtacNQHwfCAUkA710kgk153WV5Y5u13Z63b2nQ8+WvfvljY+3aONJukOftM2u5t2hxSCxfADb3Aiwo0s6Xcl1cTScHRXQPwzqU5PINusSMLKybdNy2fLjWSoxLQh8lk/wwF25FXlEg/dZyUICqJ00T8qGJjXKoUZYJGhB8OrLQMbgB2OAOQG0NPtzpA0e2GLNp0jvvFjdHn3xNegFkmZGbpfILO763EwZ3KfWfcnBJxe/u0bOOWmkszLRPVVLinGDG+Tdh/7V8sx+Q3ZNxd2RAAq5DCZ75u3V6RXKLgtDpkDryq2/+F+YlJNCOH04LjjlJLlu6llZUySt+Utfl+Xrkp6a7OtSSHl3IgBueL++WdEi86en6x0LnpLDiAlZ8sFHjosAHcBGDqgH7T4J2lkzBqaIYYLGEASlgK1sXoXjT7v3L0S9zt1rpWPHKgudGPaGZApmxhCmD4OSBCyo8Rt0jr+6AXqGWsW8VPAXi2uD4MFttifFectOfhGTGN5CyQJC/Asg9Pim6VNyYgzcTqzaskOqy0tVcFCScP6uyNCMMOH8Ue0eJVonXlu7IR5ViEmYD6An505YVx5bvMxKDhacIPrMDWMgraVwW1/K/jaAoj6kruumnp01Y6C0wOC8X7/8V8X4/ZBC7FIb1UVhzC3CV2ecB+kiGSntijEoCiaOqO7z/A+lBk+JtVhkDHxuhnCzs+cicSkx8CwIL85diKhzJuycAbZthljT6lDgOpnLneu1CkM2iZhU2lFMJNPIBZiO8fz0kecqlW+gXiGTojKeZ/y8gHzn70SPVpLNsE7saTwsfjDHfAHbkJPXDCE8y2Vb4NjXLvUiZATxIDdzqeLXjFnh1mdEvwa5ZfYF8rWZ51uQrLPN8qp4b+hUpCa1blJgwvCMCC/8D7wlOGwjUAG/fERg2ucPOi3cvFs5QBmHzxRvjQtTMk5cipn2laRbuaFPyHTuemKhLHz9XeFK5QRkbv1rqmXhN/4Ouoj8+hY45cnn1G3kvd7pMiyydwzZpl/MjZ+doiROntFgB+des2MW0b3yYWjdj8mu4/hxhyN/RV2cQUBqiEEqwJEhlhowIjOMIKxI68HEqVQWhGPwBvMQTMBasbwyBRPp3ViRN+/cA+nPegCMCQXCGs+PgEIbv4UEVDtlXShUvQtZD7e0We8w3aDR6fTANIBbPIa/3/e7Z+X3y9+Wb8OF/bKzTjNeq9/8y5AW8oW5of9BPNzaNsqRHZmAt7QK0gKOb8OxavSkxMPUgqCxaO4M0TJxlABrYf/LtuhkCAH/ketutT3BYKQW3OnPq94VtkyUXmgdORKQa9/oymanxXs3QPx4ENUoGT90EM5msVJg/5AdM6iO52OYFdvMx32LcYTxr5Bg5GH+NeVHj0fHcGs0gK+MSkfu9yAnVFCLa22UOCmYX3GaU9juGm3Kp5gu2eIc5Pa/bMrI2tOH/zPjToSiscB911UgpV+wDcZsyppPHJahpqJMzj15lIQLLJWw3Pa+oVSSS2t3p6+N9jMHUa148C4oF89PCaJiPtRn8ESpeyE90AvVgKy3EjRPVp40TQZcfK9Ke2jFfGl8+38cg4uMDNz8pgui8tcMSJCiRUKZS20KSYWAweCFlGAEPfmqEOvgBJAueDRcsYM+iAr1xHaI5xNmBLQJB8rMU8fKmk92IpKuWQ3ijOm6gVAOu3hVeZmEmDf+egKYK9uIwWf0XQiFGcyV/5I4BVGRMfFQWTegD6JiX3tkeDZ9bcqM9TeCqOadN0nmI4iKz+xNQAsVx8XHMLlOPmG4opA1Y6A4ThHdCBZSK3G+Oxz0sgmiUo5JPE9RxxhQdT+ZQdcIcHKLNtrvaDBZsjO7G0TFFXMMgrB4sOvzMIV50ygFjbbJ6Rd9SEbw0Jcux9Fts2TOg4/Kuk93W/a4OdHNMREn2pmIfBwB+/966Dx0Dj45kk4kIwMo9iCquooKdUK0CmizcUcyCjKQA83JIKrsGQObAQ2QAJr5CgFZ0A0e2uGYMz0n6Qex+8/3KJzg/s1K16BNgNUkhNBt7fmP2gQ997C7CjoOXvoUXAip4fkjcJpRDaQFmgYLYQp10wsR1JsefedgO/ERD6gxKeHc0MmEy/bl5MqH92N3+1pXVkavmhWQVhzo21D+Nvg9GOCOMRipevQ3BmuCsw8DuIB07tuowq1ZTOUX4fRtBzCGSMs+daKTB85QxzrQTDXztDFSgUmrvm1gWznyXf9CDHDXZcSA54SYPXEcjot/w3Xy4yIBRIYYxgaD5Axwr3w0UvbQL70Yw008hyFpfrEXhcyA5zHwL+UkaBMylUO0cIRbGL597AO3E9RQ86gvnrbkFkzyotukPYrPup4/9kQZgLiNomBWPdoazpmbdQ9HHWOIItw62oGTofOhXQdjiHa2QgG53bm1jqE3UWzT6IlH/31oI13XjOYv8+DREShG5kFmwDiAyaOH41MfJrdyXQV6n6kWKDrGYHd9tvdTGKJ/BCHT0DzaX+Vwz4hRnGicRmeRA9GCJMnH3tWw2s46bawyU0HKdgU0/aXVGYDRtnYEE9IIJRROykzMxFUhckA2rCIzTx2TQ+rsktBqkJc+Qnb2zwhmV4L8YhWVjoFif8v6JVoTIgO46qfeqvwX6H+QdrRhZaSjUxxgS7Yf7WZuQ+CpQ2XNz4rsmmcHfG/hS/LEq29aSsaou3JEWH4fFoAhfess79LdnHXiSBmBaDp+Z9LNeQz1VVUqhJonOWk9B8EBaAunJYCDm27HjMfQ4qYrYIHeXTjhZKmtrJQWKNk4kfMFPMuAlpcrvo9PPEJvZYZIOCRzz54of4sgpbRjtisRaf1g0TL50xv4wpcJVIQlpL0Hrr1MTnD4rJwJvduXRcUYGMwUPLBVgns3pFSMh7TWTrxcif5xK4I+VJfv6G/R78I7FA2e7bjn2W+qdKSfAhggwSL3ZeDEeoMfTIGCyAJY8kthabj3qkssjzPdDKitkinQ0m+E+Q4iQCb0xPtBfWvUAa88EJZei3ZQAUo47+CvOI2Zk3AhvmvJL0CllTLsRAp4P3Zog4zHNzR5NoE3jwFUZDI8KHfhivdSSw8mNLQfzOczUl/pnpDW2xu3ydvwu7AA+tqPoLm7cDT/kYDiYgyosVrddSu8Or0Zh7jShTkhDWiaCO94qGtZ1wEsgdoh+LI1nEygS9ACmAW9HymFOH2gV5vuCD/UffCWInI5YhFyWZFnnT5OnnzNKoFkqhK/fP2ZcaNl3Sefas1+LAcPi+Xn63gy8Q4cR57PlTlT+TK95/kV08GwVuCTdahAJnRX71lPryYuhA5ejGR0A3F8axqjr49Ue2a/XLipWYFwGX4dUmcopBcD6RKdADAZWieSW4vEG3XBE57COCaOX6c6noATvH+tey39zbOmSl11laN2nwOXW40N8KI7EiZRt302EwyxrKykx7wx3Za3p/CPLsYQRbg1z2HQbQkSLYj4iMqkmzBPmWL4tcU5K4HLi/j5j1RqHk8wHOLtmUpLb+hisqs90/AkIWr3DaWePSWZAz0MDUmGCkgnXHvaQt9PHDlERjf0Vy7ihc7raKZ/1DAGKnX4dWuGSqdlDBiUPCHaAMZM0JUbnMF4ZP2F8MFj5MNNEI+PI6BC86KJ43Oq8T2Xz5Y7sddl2DQ/W5cOQthaTBw1TG7GQSC5+E6ko53Luzpshy4YfyKsUe4YYi55Hc1pEjoGBiXxnAMPYxA0wD24sgZ0vUviJ72lzMni+MloLb7js3ge+jTm9Lprxkjw61OxUJvE0kgNvvLkoZZ0kabUwBBrJx0CyxXct0lkbGqumesZRL2s9Uylkv5JWzAoOKlTQgF92zumxv6V52QbqzGtATHSse9pgUewT0xOEEbXhdrwfQ1sqSxg0LYrPIFEi8PDN86TM04YJt996gVZvwOuxsTDcyUl4DJGfwHQmACmMP+265U1g1+3buNHbI28wFhaOzCuusrH/BWjYR2YXgdoK/XRG9M7blkE25eQfbIbdTDRZ7IZcAv/2bOvSKgdeWAhsQACrXiisrlMbNcoyhk1ym1JkOEG6TpxzqQBquy59jXqQe9VAn9bWCaUNWKvQxzB0rYcI8SP8M8Bn/U0IMEYqsbMiovgnsQjAyf+G4MJyvSFqDg+g5WsSpJEIuAH6kclbnlRO+kqKR82yTmNBdt2g8qUNYwXX3V/TERMJCcAwyhtGGd665G6s2/AZ+SmOOcb45mSKJcGqk6ejjBuMJp09ew7UpMyu0c84++f58yQHVPOwKffbJMzAwmasDhJjRN46MDzva9drSIKzUmJR5gwfLD5MbwgG+RnN18LjXqLNg1pD+2nN4NyOl1/wTkyZ/Kp+PTbh7Lsw/Xy1sZPpAlMhko+av8vgURy5ZRJ6hNt3E48hrz45SnjwFQYlaUK5wzW4qRoA+h89V83X+NoyYhg4RozpMFAV7+XTJog1bDO+GxKa6N97IflTp8wRn54yxcxYXmcupUxcALV4ixN81mVql2/erXCtWJbiqG94YGwZ500Ur1j2tsvmSaXTj4lp76ma/fQrgNb+bWqh798pWKg9jowM7Yt24R1IbANGNhGJmXH5+hgW53RFVlJfA84Y3zU8K4XelugGy3A7yIyvJtSQy5nHXYj696keW6BXsaQ5wbtJdfbAsdCC/w/yNeAQwKXwXYAAAAASUVORK5CYII=', width: 150, alignment: 'center', margin: [0, 20, 0, 0]}, // 11
			// 			{text: 'Disclaimer: This heat loss estimator has been designed to provide heating estimations on Power kW and Energy kWh demands for domestic and commercial properties. The tool provides approximations to aid the quotation / tendering process before a project is accepted. It is very important to note that before a heating system is installed that a full room by room heat loss calculation should be completed meeting The Chartered Institution of Building Services Engineers (CIBSE) and Microgeneration Certification Scheme (MCS) standards.', italics: true, margin:[0, 20, 0, 0], fontSize: 10}, // 12
			// 			{text: 'It’s important for the relevant persons to read this report and notify ‘company name’ of any corrections that need to be made before the heating system is installed. ‘company name’ is not liable for any inaccurate calculations made due to incorrect information, therefore it’s important that the information provided is to the best knowledge available from the home owner, architect or builder.', italics: true, margin:[0, 20, 0, 0], fontSize: 10} // 13
			// 		]
			// 	},
			// 	// page 2
			// 	{   // 1
			// 		pageBreak: 'before',
			// 		pageOrientation: 'portrait',
			// 		stack: [ // content stack
			// 			{text: 'DHW (Domestic Hot Water)', alignment: 'center', fontSize: 20, bold: true, margin: [0, 0, 0, 10]},
			// 			{
			// 				columns: [
			// 					{
			// 						width: '*',
			// 						stack: [
			// 							{text: 'Number of bedrooms: ', bold: true}, // 0
			// 							{text: 'Number of occupants per bedroom: ', bold: true}, // 1
			// 							{text: 'Flow temperature for hot water (DHW): ', bold: true}, // 2
			// 							{text: 'Hot water per occupant: ', bold: true}, // 3
			// 							{text: 'η efficiency pipework loss to cylinder: ', bold: true}, // 4
			// 							{text: 'Electricity Cost: ', bold: true}, // 5
			// 							{text: 'SHC Water: ', bold: true}, // 6
			// 							{text: 'J to kWh: ', bold: true}, // 7
			// 							{text: 'water mains input temp: ', bold: true}, // 8
			// 							{text: 'kg to litres water: ', bold: true}, // 9
			// 							{text: 'Hot water energy demand per day: ', bold: true}, // 10
			// 							{text: 'AIR SOURCE HEAT PUMP RESULTS', bold: true, margin: [0, 10, 30, 10], fontSize: 10}, // 11
			// 							{text: 'Final secondary HW temperature', bold: true}, // 12
			// 							{text: 'SPF (at Hot Water flow temperature)', bold: true}, // 13
			// 							{text: 'Hot water energy heat pump compressor per day', bold: true}, // 14
			// 							{text: 'Immersion HW electrical energy/day', bold: true}, // 15
			// 							{text: 'Total Hot water energy demand per day', bold: true}, // 16
			// 							{text: 'Annual Demand', bold: true, margin: [0, 5, 0, 0]}, // 17
			// 							{text: 'Heat supplied by HP, excluding immersion heater', bold: true}, // 18
			// 							{text: 'OIL RESULTS', bold: true, margin: [0, 10, 30, 10], fontSize: 10}, // 19
			// 							{text: 'Oil hot water demand per day', bold: true}, // 20
			// 							{text: 'Annual Demand', bold: true}, // 21
			// 							{text: 'LPG RESULTS', bold: true, margin: [0, 10, 30, 10], fontSize: 10}, // 22
			// 							{text: 'LPG hot water demand per day', bold: true}, // 23
			// 							{text: 'Annual Demand', bold: true}, // 24
			// 							// {text: 'LPG RESULTS', bold: true, margin: [0, 10, 30, 10], fontSize: 10}, // 25
			// 							// {text: 'LPG hot water demand per day', bold: true}, // 26
			// 							// {text: 'Annual Demand', bold: true}, // 27
			// 							{text: 'DIRECT ELECTRIC RESULTS', bold: true, margin: [0, 10, 30, 10], fontSize: 10}, // 28
			// 							{text: 'Electric hot water demand per day', bold: true}, // 29
			// 							{text: 'Annual Demand', bold: true}, // 30
			// 							{text: 'MAIN GAS RESULTS', bold: true, margin: [0, 10, 30, 10], fontSize: 10}, // 31
			// 							{text: 'Main gas hot water demand per day', bold: true}, // 32
			// 							{text: 'Annual Demand', bold: true} // 33
			// 						],
			// 						alignment: 'right',
			// 						fontSize: 9,
			// 						text: 'Left: '
			// 					},
			// 					{
			// 						width: '*',
			// 						stack: [
			// 							{text: ' 0'},
			// 							{text: ' 0'},
			// 							{text: ' 0 C (55 for heat pump others 70)'},
			// 							{text: ' 0 litres (if heat pump use 45, if other use 35)'},
			// 							{text: ' 0 %'},
			// 							{text: ' 0 pence per kWh'},
			// 							{text: ' 4187 J/kgK'},
			// 							{text: ' 3600000'},
			// 							{text: ' 10 C'},
			// 							{text: ' 1'},
			// 							{text: ' 0 kWh'},
			// 							{text: ' ', bold: true, margin: [0, 10, 30, 10], fontSize: 10},
			// 							{text: ' 0 C'},
			// 							{text: ' 0'},
			// 							{text: ' 0 kWh'},
			// 							{text: ' 0 kWh'},
			// 							{text: ' 0 kWh'},
			// 							{text: ' 0 kWh', margin: [0, 5, 0, 0]},
			// 							{text: ' 0 kWh'},
			// 							{text: ' ', bold: true, margin: [0, 10, 30, 10], fontSize: 10},
			// 							{text: ' 0 kWh'},
			// 							{text: ' 0 kWh'},
			// 							{text: ' ', bold: true, margin: [0, 10, 30, 10], fontSize: 10},
			// 							{text: ' 0 kWh'},
			// 							{text: ' 0 kWh'},
			// 							// {text: ' ', bold: true, margin: [0, 10, 30, 10], fontSize: 10},
			// 							// {text: ' 0 kWh'},
			// 							// {text: ' 0 kWh'},
			// 							{text: ' ', bold: true, margin: [0, 10, 30, 10], fontSize: 10},
			// 							{text: ' 0 kWh'},
			// 							{text: ' 0 kWh'},
			// 							{text: ' ', bold: true, margin: [0, 10, 30, 10], fontSize: 10},
			// 							{text: ' 0 kWh'},
			// 							{text: ' 0 kWh'}
			// 						],
			// 						margin: [5, 0, 0, 0],
			// 						alignment: 'left',
			// 						fontSize: 9,
			// 						text: 'Right'
			// 					}
			// 				],
			// 				margin: [40, 0]
			// 			}
			// 		]
			// 	},
			// ],
			// styles
			// styles: {
			// 	smallGray: {
			// 		fontSize: 9,
			// 		color: '#CCC'
			// 	},
			// 	gray: {
			// 		color: '#CCC'
			// 	},
			// 	table: {
			// 		fontSize: 8
			// 	}
			// }
		});
})();
