import React from 'react';
import 'whatwg-fetch';
import * as moment from 'moment-timezone';
import { Modal } from 'react-bootstrap';
import './Form.scss'


const validEmailRegex = RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

export class Form extends React.Component {

  constructor(props) {
    super(props);

    this.formRef = React.createRef();

    this.state = {
      modalIsOpen: false, //true,
      blockButton: false,
      ticket: "", //'https://freqways-tickets.s3.eu-west-1.amazonaws.com/ticket/04d251b4-dbfb-4145-9e77-31f9d5ce27ba.png?response-content-disposition=attachment&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEBoaDGV1LWNlbnRyYWwtMSJIMEYCIQDSgU2npINWMN6kEL7O3YbHbenAJ8%2FWmw43SETcLMqiHAIhAJwxb5d%2B%2BW6NqIS7UzC5MsCB5puuSuoCiyMvp2RwUzltKpgCCJP%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEQARoMMzM4MzcyMTY3MjU3Igy1JOz1szf2k688wjcq7AGXwx4AfCIZXbF6NzpXrnBNkcAxR3nlxqtdfDcGavFcRPtjPi9JqlZ4POAmkJsfb6HvPxaZjQLJSk5V0FtTYyNhlGiJrawVAZZdKcqULczMdMPf9H05yXUR4u7ViAvfncgkXWwaC9LrlwR2dDxtTGoPSw27JfpZAhWWdizkbIZ%2FYwfXqGe5G6x8y7T7UG1yMszkMTQbc84MsDbTRirLs5lGGgRwqQsv0K%2BFJi3%2FxAwwUxF89p5tv%2FY0ieYeahnGmmykKuOXSn5%2FhAkLzItWWDNIANnkbc52aL0XoZ%2FH95pJ8xoAjYYuoQTboy1aDDCWxJn3BTr1Ancfv8G6bjrkNOv063CnEyQQmSO%2BPhXsbuzl%2B%2FdsAh7SCQGATIvjAcfNQEBTZ40RhxTEmxGm1TZLicUveBo3abmw%2B%2BAVCxLM6cCZqYS98pZV1hnLh7HDfnf4lTPcgQUKNybz60D0QPaWTne8BbedYE1NJBjZKM7bhD4fXpgGYOXFunVuR6UNrPxNObsunl16MsIGRYTS8yGjm0DT3rCPNh44qvT77740iYVNTTYyvuw%2BHXD7T0u0db64b7bLNLiV1qU5uZCBx4V%2BlxGvDrGOMAfUhqyREMa6%2F6v%2FEwT9nn6xZivwyv1tjYO%2Bj5iEGGqw%2B5gUF1AEtE%2BYEphDtRmWWKSCEwve4Gv3AbHIqf2qaai4RhrdzHfFif%2F0nCYdI18D4PfG8Uwa6MU2J7T7eSUhoFY4tZZk%2BU5Agj70R6%2FUQYIaBH00xGsbbUIhJ6yPWT9JC%2BX3kdJIXTleDDB34E1xy7wcIO%2B1wgjIXbOKIFIabpb%2FrOGNOPQ%3D&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20200614T174648Z&X-Amz-SignedHeaders=host&X-Amz-Expires=300&X-Amz-Credential=ASIAU5SENQZM7MKCAG6D%2F20200614%2Feu-west-1%2Fs3%2Faws4_request&X-Amz-Signature=d82ec423b85797a94c9610f98a8b7719fb7f056dc8f414259b4b85d343292def',
      email: null,
      name: null,
      country: '',
      errors: {
        email: '', name: '', country: ''
      },
      result: {
        error: false
      }
    };
  }

  closeModal() {
    this.setState({
      modalIsOpen: false,
      name: '',
      email: '',
      country: ''
    });
  }

  handleChange(event) {
    event.preventDefault();
    const { name, value } = event.target;
    let errors = this.state.errors;

    switch (name) {
      case 'email':
        errors.email = validEmailRegex.test(value) ? '' : 'Enter valid email address';
        break;
      case 'name':
        errors.name = value.length < 3 ? 'Name must be at least 3 characters long' : '';
        break;
      case 'country':
        errors.country = value.length < 3 ? 'Country cannot be empty' : '';
        break;
      default:
        break;
    }

    this.setState({errors, [name]: value}, () => {});
  }

  handleSubmit(event) {
    event.preventDefault();
    if (this.state.errors.email || this.state.errors.name || this.state.errors.country) {
      return;
    }

    this.setState({blockButton: true});
    window.fetch('https://zuspgnrnl4.execute-api.eu-west-1.amazonaws.com/stable/register', {
      method: 'POST',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: this.state.email,
        name: this.state.name,
        country: this.state.country,
        timezone: moment.tz.guess(true)
      })
    }).then(response => {
      response.json().then(data => {
        this.setState({
          result: {error: data.ticket.length === 0},
          blockButton: false,
          ticket: data.ticket,
          modalIsOpen: data.ticket.length > 0
        });
        // event.target.reset();
        this.formRef.reset();
      });
    }).catch(error => {
      this.setState({
        result: {error: true},
        blockButton: false
      });
    });
  }

  render() {
    return (
      <div className="form-row">
        {this.state.result.error ? (
            <div className={'registration-alert'}>Registration failed. Try again.</div>
        ) : ''}
        <form onSubmit={this.handleSubmit.bind(this)} ref={r => this.formRef = r} noValidate>
          <input type="text" name="name" id="field-1" className={'form-control' + (this.state.errors.name ? ' is-invalid' : '')} onChange={this.handleChange.bind(this)} placeholder={"Name"} noValidate />
          <div className="select-div" id="field-2">
            <select className="form-control select-form"
                    id="country" name={"country"} onChange={this.handleChange.bind(this)}>
              <option value="">Country</option>
              <option value="Afghanistan">Afghanistan</option>
              <option value="Åland Islands">Åland Islands</option>
              <option value="Albania">Albania</option>
              <option value="Algeria">Algeria</option>
              <option value="American Samoa">American Samoa</option>
              <option value="Andorra">Andorra</option>
              <option value="Angola">Angola</option>
              <option value="Anguilla">Anguilla</option>
              <option value="Antarctica">Antarctica</option>
              <option value="Antigua and Barbuda">Antigua and Barbuda</option>
              <option value="Argentina">Argentina</option>
              <option value="Armenia">Armenia</option>
              <option value="Aruba">Aruba</option>
              <option value="Australia">Australia</option>
              <option value="Austria">Austria</option>
              <option value="Azerbaijan">Azerbaijan</option>
              <option value="Bahamas">Bahamas</option>
              <option value="Bahrain">Bahrain</option>
              <option value="Bangladesh">Bangladesh</option>
              <option value="Barbados">Barbados</option>
              <option value="Belarus">Belarus</option>
              <option value="Belgium">Belgium</option>
              <option value="Belize">Belize</option>
              <option value="Benin">Benin</option>
              <option value="Bermuda">Bermuda</option>
              <option value="Bhutan">Bhutan</option>
              <option value="Bolivia">Bolivia</option>
              <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
              <option value="Botswana">Botswana</option>
              <option value="Bouvet Island">Bouvet Island</option>
              <option value="Brazil">Brazil</option>
              <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
              <option value="Brunei Darussalam">Brunei Darussalam</option>
              <option value="Bulgaria">Bulgaria</option>
              <option value="Burkina Faso">Burkina Faso</option>
              <option value="Burundi">Burundi</option>
              <option value="Cambodia">Cambodia</option>
              <option value="Cameroon">Cameroon</option>
              <option value="Canada">Canada</option>
              <option value="Cape Verde">Cape Verde</option>
              <option value="Cayman Islands">Cayman Islands</option>
              <option value="Central African Republic">Central African Republic</option>
              <option value="Chad">Chad</option>
              <option value="Chile">Chile</option>
              <option value="China">China</option>
              <option value="Christmas Island">Christmas Island</option>
              <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
              <option value="Colombia">Colombia</option>
              <option value="Comoros">Comoros</option>
              <option value="Congo">Congo</option>
              <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
              <option value="Cook Islands">Cook Islands</option>
              <option value="Costa Rica">Costa Rica</option>
              <option value="Cote D'ivoire">Cote D'ivoire</option>
              <option value="Croatia">Croatia</option>
              <option value="Cuba">Cuba</option>
              <option value="Cyprus">Cyprus</option>
              <option value="Czech Republic">Czech Republic</option>
              <option value="Denmark">Denmark</option>
              <option value="Djibouti">Djibouti</option>
              <option value="Dominica">Dominica</option>
              <option value="Dominican Republic">Dominican Republic</option>
              <option value="Ecuador">Ecuador</option>
              <option value="Egypt">Egypt</option>
              <option value="El Salvador">El Salvador</option>
              <option value="Equatorial Guinea">Equatorial Guinea</option>
              <option value="Eritrea">Eritrea</option>
              <option value="Estonia">Estonia</option>
              <option value="Ethiopia">Ethiopia</option>
              <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
              <option value="Faroe Islands">Faroe Islands</option>
              <option value="Fiji">Fiji</option>
              <option value="Finland">Finland</option>
              <option value="France">France</option>
              <option value="French Guiana">French Guiana</option>
              <option value="French Polynesia">French Polynesia</option>
              <option value="French Southern Territories">French Southern Territories</option>
              <option value="Gabon">Gabon</option>
              <option value="Gambia">Gambia</option>
              <option value="Georgia">Georgia</option>
              <option value="Germany">Germany</option>
              <option value="Ghana">Ghana</option>
              <option value="Gibraltar">Gibraltar</option>
              <option value="Greece">Greece</option>
              <option value="Greenland">Greenland</option>
              <option value="Grenada">Grenada</option>
              <option value="Guadeloupe">Guadeloupe</option>
              <option value="Guam">Guam</option>
              <option value="Guatemala">Guatemala</option>
              <option value="Guernsey">Guernsey</option>
              <option value="Guinea">Guinea</option>
              <option value="Guinea-bissau">Guinea-bissau</option>
              <option value="Guyana">Guyana</option>
              <option value="Haiti">Haiti</option>
              <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
              <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
              <option value="Honduras">Honduras</option>
              <option value="Hong Kong">Hong Kong</option>
              <option value="Hungary">Hungary</option>
              <option value="Iceland">Iceland</option>
              <option value="India">India</option>
              <option value="Indonesia">Indonesia</option>
              <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
              <option value="Iraq">Iraq</option>
              <option value="Ireland">Ireland</option>
              <option value="Isle of Man">Isle of Man</option>
              <option value="Israel">Israel</option>
              <option value="Italy">Italy</option>
              <option value="Jamaica">Jamaica</option>
              <option value="Japan">Japan</option>
              <option value="Jersey">Jersey</option>
              <option value="Jordan">Jordan</option>
              <option value="Kazakhstan">Kazakhstan</option>
              <option value="Kenya">Kenya</option>
              <option value="Kiribati">Kiribati</option>
              <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
              <option value="Korea, Republic of">Korea, Republic of</option>
              <option value="Kuwait">Kuwait</option>
              <option value="Kyrgyzstan">Kyrgyzstan</option>
              <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
              <option value="Latvia">Latvia</option>
              <option value="Lebanon">Lebanon</option>
              <option value="Lesotho">Lesotho</option>
              <option value="Liberia">Liberia</option>
              <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
              <option value="Liechtenstein">Liechtenstein</option>
              <option value="Lithuania">Lithuania</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Macao">Macao</option>
              <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
              <option value="Madagascar">Madagascar</option>
              <option value="Malawi">Malawi</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Maldives">Maldives</option>
              <option value="Mali">Mali</option>
              <option value="Malta">Malta</option>
              <option value="Marshall Islands">Marshall Islands</option>
              <option value="Martinique">Martinique</option>
              <option value="Mauritania">Mauritania</option>
              <option value="Mauritius">Mauritius</option>
              <option value="Mayotte">Mayotte</option>
              <option value="Mexico">Mexico</option>
              <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
              <option value="Moldova, Republic of">Moldova, Republic of</option>
              <option value="Monaco">Monaco</option>
              <option value="Mongolia">Mongolia</option>
              <option value="Montenegro">Montenegro</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Morocco">Morocco</option>
              <option value="Mozambique">Mozambique</option>
              <option value="Myanmar">Myanmar</option>
              <option value="Namibia">Namibia</option>
              <option value="Nauru">Nauru</option>
              <option value="Nepal">Nepal</option>
              <option value="Netherlands">Netherlands</option>
              <option value="Netherlands Antilles">Netherlands Antilles</option>
              <option value="New Caledonia">New Caledonia</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Nicaragua">Nicaragua</option>
              <option value="Niger">Niger</option>
              <option value="Nigeria">Nigeria</option>
              <option value="Niue">Niue</option>
              <option value="Norfolk Island">Norfolk Island</option>
              <option value="Northern Mariana Islands">Northern Mariana Islands</option>
              <option value="Norway">Norway</option>
              <option value="Oman">Oman</option>
              <option value="Pakistan">Pakistan</option>
              <option value="Palau">Palau</option>
              <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
              <option value="Panama">Panama</option>
              <option value="Papua New Guinea">Papua New Guinea</option>
              <option value="Paraguay">Paraguay</option>
              <option value="Peru">Peru</option>
              <option value="Philippines">Philippines</option>
              <option value="Pitcairn">Pitcairn</option>
              <option value="Poland">Poland</option>
              <option value="Portugal">Portugal</option>
              <option value="Puerto Rico">Puerto Rico</option>
              <option value="Qatar">Qatar</option>
              <option value="Reunion">Reunion</option>
              <option value="Romania">Romania</option>
              <option value="Russian Federation">Russian Federation</option>
              <option value="Rwanda">Rwanda</option>
              <option value="Saint Helena">Saint Helena</option>
              <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
              <option value="Saint Lucia">Saint Lucia</option>
              <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
              <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
              <option value="Samoa">Samoa</option>
              <option value="San Marino">San Marino</option>
              <option value="Sao Tome and Principe">Sao Tome and Principe</option>
              <option value="Saudi Arabia">Saudi Arabia</option>
              <option value="Senegal">Senegal</option>
              <option value="Serbia">Serbia</option>
              <option value="Seychelles">Seychelles</option>
              <option value="Sierra Leone">Sierra Leone</option>
              <option value="Singapore">Singapore</option>
              <option value="Slovakia">Slovakia</option>
              <option value="Slovenia">Slovenia</option>
              <option value="Solomon Islands">Solomon Islands</option>
              <option value="Somalia">Somalia</option>
              <option value="South Africa">South Africa</option>
              <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
              <option value="Spain">Spain</option>
              <option value="Sri Lanka">Sri Lanka</option>
              <option value="Sudan">Sudan</option>
              <option value="Suriname">Suriname</option>
              <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
              <option value="Swaziland">Swaziland</option>
              <option value="Sweden">Sweden</option>
              <option value="Switzerland">Switzerland</option>
              <option value="Syrian Arab Republic">Syrian Arab Republic</option>
              <option value="Taiwan, Province of China">Taiwan, Province of China</option>
              <option value="Tajikistan">Tajikistan</option>
              <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
              <option value="Thailand">Thailand</option>
              <option value="Timor-leste">Timor-leste</option>
              <option value="Togo">Togo</option>
              <option value="Tokelau">Tokelau</option>
              <option value="Tonga">Tonga</option>
              <option value="Trinidad and Tobago">Trinidad and Tobago</option>
              <option value="Tunisia">Tunisia</option>
              <option value="Turkey">Turkey</option>
              <option value="Turkmenistan">Turkmenistan</option>
              <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
              <option value="Tuvalu">Tuvalu</option>
              <option value="Uganda">Uganda</option>
              <option value="Ukraine">Ukraine</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
              <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
              <option value="Uruguay">Uruguay</option>
              <option value="Uzbekistan">Uzbekistan</option>
              <option value="Vanuatu">Vanuatu</option>
              <option value="Venezuela">Venezuela</option>
              <option value="Viet Nam">Viet Nam</option>
              <option value="Virgin Islands, British">Virgin Islands, British</option>
              <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
              <option value="Wallis and Futuna">Wallis and Futuna</option>
              <option value="Western Sahara">Western Sahara</option>
              <option value="Yemen">Yemen</option>
              <option value="Zambia">Zambia</option>
              <option value="Zimbabwe">Zimbabwe</option>
            </select>
          </div>
          <div id="field-3" className={"invalid-feedback"}>{this.state.errors.name}</div>
          <div id="field-4" className={"invalid-feedback"}>{this.state.errors.country}</div>
          <input id="field-5" type="email" name="email"
                 className={'form-control' + (this.state.errors.email ? ' is-invalid' : '')} onChange={this.handleChange.bind(this)} placeholder={"Email"} noValidate />
          <button id="field-6" type={'submit'} disabled={this.state.blockButton || this.state.errors.email || this.state.errors.name || !this.state.email || !this.state.name} className={"submit-button"}>
            { this.state.blockButton ? 'Wait...' : 'Book now' }
          </button>
          <div id="field-7" className={"invalid-feedback"}>{this.state.errors.email}</div>
        </form>
          <Modal show={this.state.modalIsOpen}
                 animation={false}
                 backdrop="static"
                 dialogClassName={'ticket-dialog'}
                 size={"lg"}
                 keyboard={false}>
              <Modal.Body>
                { this.state.ticket ? (
                  <div>
                    <div className={'ticket-link'}>
                      Click on the icon to save or print your boarding pass
                      {/*<a href={"https://www.facebook.com/sharer/sharer.php?u=" + encodeURI("https://freqways.mdlbeast.com") +  "&imageurl=" + encodeURI(this.state.ticket) + "&t=#FREQWAYS"}*/}
                      {/*   onClick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');return false;"*/}
                      {/*   target="_blank" title="Share on Facebook">*/}
                      {/*  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill={'#d1d3d4'} d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/></svg>*/}
                      {/*</a>*/}
                      {/*<a href={"https://twitter.com/share?url=" + encodeURI(this.state.ticket) + "&via=TWITTER_HANDLE&text=#FREQWAYS"}*/}
                      {/*   onClick="javascript:window.open(this.href, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');return false;"*/}
                      {/*   target="_blank" title="Share on Twitter">*/}
                      {/*  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill={'#d1d3d4'} d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm6.066 9.645c.183 4.04-2.83 8.544-8.164 8.544-1.622 0-3.131-.476-4.402-1.291 1.524.18 3.045-.244 4.252-1.189-1.256-.023-2.317-.854-2.684-1.995.451.086.895.061 1.298-.049-1.381-.278-2.335-1.522-2.304-2.853.388.215.83.344 1.301.359-1.279-.855-1.641-2.544-.889-3.835 1.416 1.738 3.533 2.881 5.92 3.001-.419-1.796.944-3.527 2.799-3.527.825 0 1.572.349 2.096.907.654-.128 1.27-.368 1.824-.697-.215.671-.67 1.233-1.263 1.589.581-.07 1.135-.224 1.649-.453-.384.578-.87 1.084-1.433 1.489z"/></svg>*/}
                      {/*</a>*/}
                        {/*<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill={'#d1d3d4'} d="M5 9c1.654 0 3 1.346 3 3s-1.346 3-3 3-3-1.346-3-3 1.346-3 3-3zm0-2c-2.762 0-5 2.239-5 5s2.238 5 5 5 5-2.239 5-5-2.238-5-5-5zm15 9c-1.165 0-2.204.506-2.935 1.301l-5.488-2.927c-.23.636-.549 1.229-.944 1.764l5.488 2.927c-.072.301-.121.611-.121.935 0 2.209 1.791 4 4 4s4-1.791 4-4-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2zm0-22c-2.209 0-4 1.791-4 4 0 .324.049.634.121.935l-5.488 2.927c.395.536.713 1.128.944 1.764l5.488-2.927c.731.795 1.77 1.301 2.935 1.301 2.209 0 4-1.791 4-4s-1.791-4-4-4zm0 6c-1.103 0-2-.897-2-2s.897-2 2-2 2 .897 2 2-.897 2-2 2z"/></svg>*/}
                      <a onClick={this.closeModal.bind(this)} href={this.state.ticket} target={'_blank'}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill={'#d1d3d4'} d="M15.003 3h2.997v5h-2.997v-5zm8.997 1v20h-24v-24h20l4 4zm-19 5h14v-7h-14v7zm16 4h-18v9h18v-9z"/></svg>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill={'#d1d3d4'} d="M16 17h-8v-1h8v1zm8-12v13h-4.048c-.404 2.423-3.486 6-6.434 6h-9.518v-6h-4v-13h4v-5h16v5h4zm-18 0h12v-3h-12v3zm12 9h-12v8h6.691c3.469 0 2-3.352 2-3.352s3.309 1.594 3.309-2v-2.648zm4-7h-20v9h2v-4h16v4h2v-9zm-9 11h-5v1h5v-1zm7.5-10c-.276 0-.5.224-.5.5s.224.5.5.5.5-.224.5-.5-.224-.5-.5-.5z"/></svg>
                      </a>
                      <a onClick={this.closeModal.bind(this)}>
                        <svg className={'close'} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill={'#d1d3d4'} d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/></svg>
                      </a>
                    </div>
                    <div className={'img-container'}>
                      <img style={{width: '100%'}} className={'img-fluid'} src={this.state.ticket} />
                    </div>
                    </div>
                ) : '' }
              </Modal.Body>
          </Modal>
      </div>
    );
  }
}