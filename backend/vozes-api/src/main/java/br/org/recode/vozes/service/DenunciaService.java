package br.org.recode.vozes.service;

import br.org.recode.vozes.DTO.DenunciaRequestDTO;
import br.org.recode.vozes.model.Anexo;
import br.org.recode.vozes.model.Denuncia;
import br.org.recode.vozes.repository.DenunciaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class DenunciaService {
    @Autowired
    private DenunciaRepository denunciaRepository;

    @Transactional
    public Denuncia criarDenuncia(DenunciaRequestDTO data) {
        Denuncia novaDenuncia = new Denuncia();
        novaDenuncia.setNome(data.nome());
        novaDenuncia.setEmail(data.email());
        novaDenuncia.setData(data.data());
        novaDenuncia.setLocalIncidente(data.localIncidente());
        novaDenuncia.setDescricao(data.descricao());
        novaDenuncia.setAutor(null);

        if (data.anexos() != null && !data.anexos().isEmpty()) {// Verifica se há anexos na denúncia
            List<Anexo> listaAnexos = new ArrayList<>();
            data.anexos().forEach(anexoRequestDTO -> {
                Anexo anexo = new Anexo();
                anexo.setTipoArquivo(anexoRequestDTO.tipoArquivo());
                anexo.setCaminhoArquivo(anexoRequestDTO.caminhoArquivo());
                anexo.setDenuncia(novaDenuncia);
                listaAnexos.add(anexo);
            });
            novaDenuncia.setAnexos(listaAnexos);
        }
        return denunciaRepository.save(novaDenuncia);
    }
}
