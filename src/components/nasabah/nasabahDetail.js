import React from 'react'
import { Redirect } from 'react-router-dom'
import Loader from 'react-loader-spinner'
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { getProfileNasabahDetailFunction } from './saga'
import { getToken } from '../index/token';
import GridDetail from '../subComponent/GridDetail';
import { formatNumber, handleFormatDate, decryptImage } from '../global/globalFunction';
import DialogComponent from './../subComponent/DialogComponent'
import TitleBar from '../subComponent/TitleBar';
import { Grid, Button } from '@material-ui/core';

const styles = (theme) => ({
    container: {
      flexGrow: 1,
    },
  });

class profileNasabahDetail extends React.Component{
    _isMounted = false;

    state = {
      diKlik:false,
      errorMessage:'',
      dataUser: {},
      idUser: 0,
      disabled: true,
      loading: true,
      dialog: false,
      title: '',
      message: '',
    };

    componentDidMount(){
      this._isMounted = true;

      this.setState({
        idUser: this.props.match.params.id,
      },() => {
        this.refresh();
      })
      
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    isCategoryExist = (category) => {
      if(category && category.toString().toLowerCase() === 'agent') {
        return 'Agen'
      } else if(category && category.toString().toLowerCase() === 'account_executive') {
        return 'Account Executive'
      } 

      return 'Personal';
    }

    refresh = async function(){
      const param = {};
      param.id = this.state.idUser;

      const data = await getProfileNasabahDetailFunction(param);
      

      if(data) {
          console.log(data)
          if(!data.error) {
            const dataUser = data.dataUser.data || {};
            let flag = false;
            
            dataUser.category = this.isCategoryExist(dataUser.category) ;
            dataUser.idcard_image = dataUser.idcard_image && decryptImage(dataUser.idcard_image);
            dataUser.taxid_image = dataUser.taxid_image && decryptImage(dataUser.taxid_image)

           

            this.setState({
              diKlik: flag,
              dataUser,
              listRole: data.dataRole,
              loading: false,
            })
          } else {
            this.setState({
              errorMessage: data.error,
              loading: false,
            })
          }      
      }
    }

    btnCancel = ()=>{
      this.setState({diKlik:true})
    }

    UNSAFE_componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    handleDialog = (e) => {
      let label = e.target.value
      let title = '';
      let message='';

      if(label.toLowerCase().includes('ktp')) {
        title = 'KTP'
        message = this.state.dataUser && this.state.dataUser.idcard_image

      } else if(label.toLowerCase().includes('npwp')) {
        title = 'NPWP'
        message = this.state.dataUser && this.state.dataUser.taxid_image

      }

      this.setState({
        dialog: true,
        message,
        title,
      })
    }


    handleClose = () => {
      this.setState({dialog: false})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/nasabahList'/>            
        } else if (this.state.loading){
          return  (
            <div  key="zz">
              <div align="center" colSpan={6}>
                <Loader 
                  type="Circles"
                  color="#00BFFF"
                  height="40"	
                  width="40"
                />   
              </div>
            </div>
          )
        } else if(getToken()){
          return(
            <Grid container className="containerDetail">
              <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                <TitleBar
                  title={'Nasabah - Detail'}
                />
              </Grid>
              <Grid
                item
                sm={12} xs={12}
                style={{padding:10, marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
              >

                <Grid container>

                  <Grid item sm={12} xs={12} style={{color:'red'}}>
                    {this.state.errorMessage}
                  </Grid>

                  <Grid item sm={12} xs={12} style={{marginBottom:"10px"}}>
                    <Grid container spacing={2}>
                        <Grid item sm={2} xs={12} style={{marginBottom:'10px'}}>
                            <input className='buttonCustomAsira' type="button" style={{width:"100%"}} value="KTP Detail" onClick={this.handleDialog}></input>                               
                        </Grid>
                        <Grid item sm={2} xs={12} >
                            <input className='buttonCustomAsira' type="button" style={{width:"100%"}} value="NPWP Detail" onClick={this.handleDialog}></input>
                        </Grid>
                    </Grid>                        
                  </Grid>


                  <GridDetail
                    gridLabel={[5,6,6]}
                    background
                    noTitleLine
                    label={[
                      ['Id Nasabah','Mitra Nasabah'],
                      ['Kategori','Agen / AE'],
                      ['Tanggal Register'],
                    ]}
                    data={this.state.dataUser && [
                      [
                        this.state.dataUser.id, 
                        this.state.dataUser.bank_name
                      ],
                      [
                        this.state.dataUser.category,
                        this.state.dataUser.agent_name && (`${this.state.dataUser.agent_name} ` + (this.state.dataUser.agent_provider_name && this.state.dataUser.agent_provider_name.trim().length !== 0 ? `(${this.state.dataUser.agent_provider_name})` : '')),
                      ],
                      [
                        this.state.dataUser.created_at && handleFormatDate(this.state.dataUser.created_at)
                      ],
                    ]}                 
                  />

                  <GridDetail
                    title="Informasi Pribadi"
                    gridLabel={[5,6,6]}
                    label={[
                      ['Nama','Jenis Kelamin','No KTP','No NPWP','Email'],
                      ['Tanggal Lahir','Tempat Lahir','Pendidikan','Nama Ibu Kandung','No HP'],
                      ['Status Pernikahan','Nama Pasangan','Tanggal Lahir Pasangan','Pendidikan Pasangan','Tanggungan (orang)'],
                    ]}
                    data={this.state.dataUser && [
                      [
                        this.state.dataUser.fullname, 
                        this.state.dataUser.gender && (this.state.dataUser.gender === 'M' ? 'Pria' : 'Perempuan'),
                        this.state.dataUser.idcard_number,
                        this.state.dataUser.taxid_number,
                        this.state.dataUser.email
                      ],
                      [
                        this.state.dataUser.birthday && handleFormatDate(this.state.dataUser.birthday),
                        this.state.dataUser.birthplace,
                        this.state.dataUser.last_education,
                        this.state.dataUser.mother_name,
                        this.state.dataUser.phone
                      ],
                      [

                        this.state.dataUser.marriage_status && this.state.dataUser.marriage_status === 'married' ? 'Menikah' : 'Belum Menikah',
                        this.state.dataUser.marriage_status && this.state.dataUser.marriage_status === 'married' ? this.state.dataUser.spouse_name : '-',
                        this.state.dataUser.marriage_status && this.state.dataUser.marriage_status === 'married' ? ((this.state.dataUser.spouse_birthday && handleFormatDate(this.state.dataUser.spouse_birthday)) || '-') : '-',
                        this.state.dataUser.marriage_status && this.state.dataUser.marriage_status === 'married' ? this.state.dataUser.spouse_lasteducation : '-',
                        this.state.dataUser.dependants > 5?"Lebih dari 5":this.state.dataUser.dependants
                      ],
                    ]}                 
                  />

                  <GridDetail
                    title="Data Tempat Tinggal"
                    gridLabel={[5,6]}
                    label={[
                      ['Alamat','Provinsi','Kota','RT / RW','No Telp Rumah'],
                      ['Kecamatan','Kelurahan','Status Tempat Tinggal','Lama Menempati Rumah'],
                      [],
                    ]}
                    data={this.state.dataUser && [
                      [
                        this.state.dataUser.address, 
                        this.state.dataUser.province,
                        this.state.dataUser.city,
                        `${this.state.dataUser.neighbour_association} / ${this.state.dataUser.hamlets} `,
                        this.state.dataUser.home_phonenumber
                      ],
                      [
                        this.state.dataUser.subdistrict,
                        this.state.dataUser.urban_village,
                        this.state.dataUser.home_ownership,
                        this.state.dataUser.lived_for && `${this.state.dataUser.lived_for} tahun`,
                      ],
                      [],
                    ]}                 
                  />

                  <GridDetail
                    title="Info Pekerjaan"
                    gridLabel={[5,6,6]}
                    label={[
                      ['Jenis Pekerjaan','No Induk Pegawai','Nama Instansi','Alamat Kantor'],
                      ['Jabatan','Lama Bekerja','Nama Atasan','No Tlp Kantor'],
                      ['Gaji (perbulan)','Pendapatan Lain','Sumber Pendapatan Lain'],
                    ]}
                    data={this.state.dataUser && [
                      [
                        this.state.dataUser.field_of_work, 
                        this.state.dataUser.employee_id,
                        this.state.dataUser.employer_name,
                        this.state.dataUser.employer_address
                      ],
                      [
                        this.state.dataUser.occupation,
                        this.state.dataUser.been_workingfor && `${this.state.dataUser.been_workingfor} tahun`,
                        this.state.dataUser.direct_superiorname,
                        this.state.dataUser.employer_number,
                      ],
                      [
                        this.state.dataUser.monthly_income && `Rp ${formatNumber(this.state.dataUser.monthly_income,true)}`,
                        this.state.dataUser.other_income && `Rp ${formatNumber(this.state.dataUser.other_income,true)}`,
                        this.state.dataUser.other_incomesource,
                      ],
                    ]}                 
                  />

                  <GridDetail
                    title="Lain lain"
                    gridLabel={[8]}
                    label={[
                      ['Nama Orang Tidak Serumah Yang Bisa Dihubungi','Hubungan','Alamat Rumah','No Tlp','No HP'],
                      []
                    ]}
                    data={this.state.dataUser && [
                      [
                        this.state.dataUser.related_personname, 
                        this.state.dataUser.related_relation, 
                        this.state.dataUser.related_address,
                        this.state.dataUser.related_homenumber,
                        this.state.dataUser.related_phonenumber
                      ],
                      []
                    ]}                 
                  />


                  <div className="col-sm-12">
                    <DialogComponent
                      title={this.state.title}
                      openDialog={this.state.dialog}
                      message={this.state.message}
                      type='image'
                      onClose={this.handleClose}
                    />
                  </div>

                      
                  <Grid container style={{marginBottom:'10px', marginTop:'10px', paddingLeft:'10px', fontSize:'calc(10px + 0.3vw)'}}>
                      <Grid item xs={12} sm={12}>  
                        <Button disableElevation
                            variant='contained'
                            style={{padding: '2px', width:'100px',backgroundColor:'#2D85E9', color:'white'}}
                            onClick={this.btnCancel}
                        >
                            <b>Kembali</b>
                        </Button>    
                      </Grid>

                      
                  </Grid>
                  
                  
               </Grid>
              </Grid>
            </Grid>
          )
        } else if(!getToken()){
          return (
              <Redirect to='/login' />
          )    
        }
       
    }
}

export function mapDispatchToProps(dispatch) {
    return {
    //   getSourceTransaction: () => {
    //     dispatch(sourceTransactionRequest());
    //   },
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    };
}
  
export const mapStateToProps = createStructuredSelector({
  // user: getUserState(),
  // menu: getMenu(),
  // fetching: getFetchStatus(),
});

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
);

const withStyle = withStyles(styles);

export default compose(
    withConnect,
    withStyle,
    withRouter
  )(profileNasabahDetail);